import axios from 'axios';
import { JIKAN_BASE_URL } from '@/utils/constants';
import { jikanRateLimiter } from '@/utils/rateLimiter';

const jikanClient = axios.create({
  baseURL: JIKAN_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

jikanClient.interceptors.request.use(async (config) => {
  await jikanRateLimiter.acquire();
  return config;
});

jikanClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '2', 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return jikanClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export async function cachedGet(url, params = {}) {
  const key = `${url}?${new URLSearchParams(params).toString()}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const response = await jikanClient.get(url, { params });
  cache.set(key, { data: response.data, timestamp: Date.now() });

  if (cache.size > 200) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  return response.data;
}

export default jikanClient;
