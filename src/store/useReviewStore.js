import { create } from 'zustand';

const loadReviews = () => {
  try {
    return JSON.parse(localStorage.getItem('animeverse-reviews') || '[]');
  } catch {
    return [];
  }
};

const save = (reviews) => localStorage.setItem('animeverse-reviews', JSON.stringify(reviews));

const useReviewStore = create((set, get) => ({
  reviews: loadReviews(),

  addReview: (review) => {
    const entry = { ...review, id: Date.now(), createdAt: new Date().toISOString() };
    set((state) => {
      const reviews = [entry, ...state.reviews];
      save(reviews);
      return { reviews };
    });
  },

  deleteReview: (id) => {
    set((state) => {
      const reviews = state.reviews.filter((r) => r.id !== id);
      save(reviews);
      return { reviews };
    });
  },

  getByAnime: (animeId) => get().reviews.filter((r) => r.animeId === animeId),
}));

export default useReviewStore;
