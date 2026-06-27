import { cachedGet } from './jikanClient';

export const genreService = {
  getAnimeGenres: () => cachedGet('/genres/anime'),
};
