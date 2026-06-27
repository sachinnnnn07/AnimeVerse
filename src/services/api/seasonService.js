import { cachedGet } from './jikanClient';

export const seasonService = {
  getCurrentSeason: (params = {}) => cachedGet('/seasons/now', { sfw: true, ...params }),
  getSeason: (year, season, params = {}) => cachedGet(`/seasons/${year}/${season}`, { sfw: true, ...params }),
  getSeasonsList: () => cachedGet('/seasons'),
};
