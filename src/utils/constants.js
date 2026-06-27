export const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export const ANIME_TYPES = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

export const ANIME_STATUS = [
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
];

export const ANIME_RATINGS = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13' },
  { value: 'r17', label: 'R - 17+' },
  { value: 'r', label: 'R+' },
];

export const SORT_OPTIONS = [
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'title', label: 'Title' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'members', label: 'Members' },
  { value: 'favorites', label: 'Favorites' },
];

export const SEASONS = ['winter', 'spring', 'summer', 'fall'];

export const WATCHLIST_STATUSES = [
  { value: 'watching', label: 'Watching', color: 'text-green-400', icon: 'play' },
  { value: 'completed', label: 'Completed', color: 'text-blue-400', icon: 'check' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'text-purple-400', icon: 'bookmark' },
  { value: 'on_hold', label: 'On Hold', color: 'text-yellow-400', icon: 'pause' },
  { value: 'dropped', label: 'Dropped', color: 'text-red-400', icon: 'x' },
];

export const TOP_FILTERS = [
  { value: '', label: 'All Time' },
  { value: 'airing', label: 'Airing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'bypopularity', label: 'Most Popular' },
  { value: 'favorite', label: 'Most Favorited' },
];

export const ITEMS_PER_PAGE = 24;

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  BROWSE: '/browse',
  ANIME_DETAIL: '/anime/:id',
  CHARACTER_DETAIL: '/character/:id',
  SEASONAL: '/seasonal',
  TOP: '/top',
  WATCHLIST: '/watchlist',
  RECOMMENDATIONS: '/recommendations',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
};
