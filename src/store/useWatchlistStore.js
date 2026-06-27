import { create } from 'zustand';

const useWatchlistStore = create((set, get) => ({
  items: [],
  loading: false,

  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),

  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  updateItem: (animeId, data) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.animeId === animeId ? { ...item, ...data } : item
      ),
    })),

  removeItem: (animeId) =>
    set((state) => ({
      items: state.items.filter((item) => item.animeId !== animeId),
    })),

  isInWatchlist: (animeId) =>
    get().items.some((item) => item.animeId === animeId),

  getStatus: (animeId) =>
    get().items.find((item) => item.animeId === animeId)?.status || null,

  getByStatus: (status) =>
    get().items.filter((item) => item.status === status),
}));

export default useWatchlistStore;
