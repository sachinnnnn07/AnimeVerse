import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('animeverse-theme');
  if (saved) return saved;
  return 'dark';
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light-theme');
  } else {
    root.classList.remove('light-theme');
  }
};

const initial = getInitialTheme();
applyTheme(initial);

const useThemeStore = create((set) => ({
  theme: initial,
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('animeverse-theme', next);
      applyTheme(next);
      return { theme: next };
    }),
}));

export default useThemeStore;
