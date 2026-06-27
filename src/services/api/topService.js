import { cachedGet } from './jikanClient';

export const topService = {
  getTopAnime: (params = {}) => cachedGet('/top/anime', { sfw: true, ...params }),
};
