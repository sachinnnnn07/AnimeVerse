import { cachedGet } from './jikanClient';

export const animeService = {
  search: (params) => cachedGet('/anime', { sfw: true, ...params }),
  getById: (id) => cachedGet(`/anime/${id}/full`),
  getCharacters: (id) => cachedGet(`/anime/${id}/characters`),
  getEpisodes: (id, page = 1) => cachedGet(`/anime/${id}/episodes`, { page }),
  getRecommendations: (id) => cachedGet(`/anime/${id}/recommendations`),
  getReviews: (id, page = 1) => cachedGet(`/anime/${id}/reviews`, { page }),
  getStatistics: (id) => cachedGet(`/anime/${id}/statistics`),
};
