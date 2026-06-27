import { create } from 'zustand';

const MAX_RECENT = 20;

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem('animeverse-recent') || '[]');
  } catch {
    return [];
  }
};

const useRecentStore = create((set, get) => ({
  items: loadRecent(),

  addItem: (anime) => {
    const entry = {
      mal_id: anime.mal_id,
      title: anime.title_english || anime.title,
      image: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
      type: anime.type,
      score: anime.score,
      viewedAt: Date.now(),
    };
    set((state) => {
      const filtered = state.items.filter((i) => i.mal_id !== anime.mal_id);
      const items = [entry, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem('animeverse-recent', JSON.stringify(items));
      return { items };
    });
  },

  clearAll: () => {
    localStorage.removeItem('animeverse-recent');
    set({ items: [] });
  },
}));

export default useRecentStore;
