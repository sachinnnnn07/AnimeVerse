import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import AnimeGrid from '@/components/anime/AnimeGrid';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import { animeService } from '@/services/api/animeService';
import { genreService } from '@/services/api/genreService';
import { useDebounce } from '@/hooks/useDebounce';
import { ANIME_TYPES, ANIME_STATUS, SORT_OPTIONS } from '@/utils/constants';

function FilterDropdown({ label, options, value, onChange, icon }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          value
            ? 'glass-strong text-primary-400 border border-primary-500/30'
            : 'glass text-white/60 hover:text-white/80'
        }`}
      >
        {label}
        {value && <span className="text-[10px] bg-primary-500/30 px-1.5 py-0.5 rounded-md">{options.find((o) => o.value === value)?.label}</span>}
        <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 min-w-[180px] glass-strong rounded-xl overflow-hidden z-20 shadow-xl shadow-black/30"
            >
              <button
                onClick={() => { onChange(''); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  !value ? 'text-primary-400 bg-primary-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                All
              </button>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    value === option.value ? 'text-primary-400 bg-primary-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    orderBy: searchParams.get('order_by') || 'score',
    sort: 'desc',
    genre: searchParams.get('genre') || '',
  });

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    genreService.getAnimeGenres()
      .then((data) => setGenres(data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionSelect = (anime) => {
    setSuggestionsVisible(false);
    navigate(`/anime/${anime.mal_id}`);
  };

  const { handleKeyDown: suggestionsKeyDown, dropdown: suggestionsDropdown } = SearchSuggestions({
    query,
    onSelect: handleSuggestionSelect,
    visible: suggestionsVisible,
  });

  const fetchAnime = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 24,
        order_by: filters.orderBy,
        sort: filters.sort,
      };
      if (debouncedQuery) params.q = debouncedQuery;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.genre) params.genres = filters.genre;

      const data = await animeService.search(params);
      let results = data.data || [];

      if (debouncedQuery && debouncedQuery.trim().length > 0) {
        const q = debouncedQuery.toLowerCase().trim();
        results = results.filter((a) => {
          const titles = [a.title, a.title_english, a.title_japanese, ...(a.title_synonyms || [])].filter(Boolean);
          return titles.some((t) => t.toLowerCase().includes(q));
        });
      }

      setAnime((prev) => (append ? [...prev, ...results] : results));
      setHasMore(data.pagination?.has_next_page || false);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  useEffect(() => {
    setAnime([]);
    fetchAnime(1);
    const params = {};
    if (query) params.q = query;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.orderBy !== 'score') params.order_by = filters.orderBy;
    if (filters.genre) params.genre = filters.genre;
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, filters]);

  const loadMore = () => {
    if (!loading && hasMore) fetchAnime(page + 1, true);
  };

  const activeFilterCount = [filters.type, filters.status, filters.genre].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
          {debouncedQuery ? (
            <>Results for "<span className="text-gradient">{debouncedQuery}</span>"</>
          ) : (
            'Discover Anime'
          )}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group" ref={searchWrapperRef}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center">
              <FiSearch className="absolute left-4 w-5 h-5 text-white/30" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSuggestionsVisible(true);
                }}
                onFocus={() => setSuggestionsVisible(true)}
                onKeyDown={suggestionsKeyDown}
                placeholder="Search by title..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white placeholder-white/30 outline-none focus:border-primary-500/40 focus:bg-white/[0.06] transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            {suggestionsDropdown}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              showFilters || activeFilterCount
                ? 'glass-strong text-primary-400 border border-primary-500/30'
                : 'glass text-white/60 hover:text-white/80'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <FilterDropdown
                  label="Type"
                  options={ANIME_TYPES}
                  value={filters.type}
                  onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
                />
                <FilterDropdown
                  label="Status"
                  options={ANIME_STATUS}
                  value={filters.status}
                  onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                />
                <FilterDropdown
                  label="Sort By"
                  options={SORT_OPTIONS}
                  value={filters.orderBy}
                  onChange={(v) => setFilters((f) => ({ ...f, orderBy: v || 'score' }))}
                />
                {genres.length > 0 && (
                  <FilterDropdown
                    label="Genre"
                    options={genres.map((g) => ({ value: String(g.mal_id), label: g.name }))}
                    value={filters.genre}
                    onChange={(v) => setFilters((f) => ({ ...f, genre: v }))}
                  />
                )}

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters({ type: '', status: '', orderBy: 'score', sort: 'desc', genre: '' })}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiX className="w-3.5 h-3.5" /> Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} loading={loading && page > 1}>
        <AnimeGrid anime={anime} loading={loading && page === 1} />
      </InfiniteScroll>
    </div>
  );
}
