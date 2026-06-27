import { cachedGet } from './jikanClient';

export const characterService = {
  getById: (id) => cachedGet(`/characters/${id}/full`),
};
