import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import AnimeGrid from '@/components/anime/AnimeGrid';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { animeService } from '@/services/api/animeService';
import { genreService } from '@/services/api/genreService';

const GENRE_EMOJI_MAP = {
  1: { emoji: '⚔️', gradient: 'from-red-600 to-orange-500' },
  2: { emoji: '🗺️', gradient: 'from-emerald-600 to-teal-500' },
  4: { emoji: '😂', gradient: 'from-yellow-500 to-amber-500' },
  5: { emoji: '🏎️', gradient: 'from-sky-500 to-blue-600' },
  6: { emoji: '😈', gradient: 'from-red-800 to-gray-900' },
  7: { emoji: '🔍', gradient: 'from-amber-600 to-yellow-700' },
  8: { emoji: '🎭', gradient: 'from-blue-600 to-indigo-500' },
  9: { emoji: '🍳', gradient: 'from-orange-400 to-amber-500' },
  10: { emoji: '🔮', gradient: 'from-violet-600 to-purple-500' },
  11: { emoji: '🎮', gradient: 'from-indigo-500 to-blue-600' },
  13: { emoji: '🏯', gradient: 'from-amber-700 to-yellow-800' },
  14: { emoji: '👻', gradient: 'from-gray-700 to-gray-900' },
  15: { emoji: '👧', gradient: 'from-pink-400 to-rose-400' },
  17: { emoji: '🥋', gradient: 'from-red-700 to-orange-700' },
  18: { emoji: '🤖', gradient: 'from-slate-500 to-gray-700' },
  19: { emoji: '🎵', gradient: 'from-pink-500 to-violet-500' },
  20: { emoji: '🤡', gradient: 'from-yellow-400 to-lime-500' },
  22: { emoji: '💕', gradient: 'from-pink-500 to-rose-500' },
  23: { emoji: '🏫', gradient: 'from-blue-400 to-sky-500' },
  24: { emoji: '🚀', gradient: 'from-cyan-500 to-blue-600' },
  25: { emoji: '🎓', gradient: 'from-blue-500 to-indigo-500' },
  26: { emoji: '🔥', gradient: 'from-orange-600 to-red-600' },
  27: { emoji: '💪', gradient: 'from-orange-500 to-red-500' },
  28: { emoji: '🌸', gradient: 'from-pink-300 to-rose-400' },
  29: { emoji: '🚀', gradient: 'from-gray-500 to-slate-600' },
  30: { emoji: '⚽', gradient: 'from-green-500 to-emerald-600' },
  31: { emoji: '🦸', gradient: 'from-blue-600 to-indigo-600' },
  32: { emoji: '🧛', gradient: 'from-red-900 to-gray-900' },
  35: { emoji: '🔞', gradient: 'from-red-500 to-red-700' },
  36: { emoji: '☀️', gradient: 'from-green-400 to-lime-500' },
  37: { emoji: '✨', gradient: 'from-purple-500 to-fuchsia-600' },
  38: { emoji: '🎖️', gradient: 'from-green-700 to-emerald-800' },
  39: { emoji: '👮', gradient: 'from-blue-700 to-slate-700' },
  40: { emoji: '🧠', gradient: 'from-indigo-600 to-purple-700' },
  41: { emoji: '😰', gradient: 'from-gray-600 to-slate-800' },
  42: { emoji: '🎯', gradient: 'from-gray-500 to-slate-600' },
  43: { emoji: '👦', gradient: 'from-blue-500 to-cyan-500' },
  46: { emoji: '🏆', gradient: 'from-yellow-500 to-amber-600' },
  47: { emoji: '💀', gradient: 'from-gray-800 to-black' },
  48: { emoji: '⏳', gradient: 'from-teal-500 to-cyan-600' },
  49: { emoji: '👗', gradient: 'from-pink-400 to-fuchsia-500' },
  50: { emoji: '🧪', gradient: 'from-green-500 to-teal-600' },
  51: { emoji: '🏰', gradient: 'from-amber-500 to-orange-600' },
  52: { emoji: '🔫', gradient: 'from-gray-600 to-red-800' },
  53: { emoji: '🎪', gradient: 'from-yellow-400 to-orange-500' },
  54: { emoji: '🐾', gradient: 'from-amber-400 to-yellow-500' },
  55: { emoji: '🧩', gradient: 'from-teal-500 to-emerald-600' },
  56: { emoji: '📖', gradient: 'from-violet-500 to-purple-600' },
  57: { emoji: '🏁', gradient: 'from-red-500 to-orange-500' },
  58: { emoji: '🌀', gradient: 'from-purple-600 to-indigo-700' },
  59: { emoji: '💘', gradient: 'from-rose-400 to-pink-500' },
  60: { emoji: '🗡️', gradient: 'from-gray-500 to-slate-700' },
  61: { emoji: '🎤', gradient: 'from-pink-500 to-purple-500' },
  62: { emoji: '🌍', gradient: 'from-emerald-500 to-teal-600' },
  63: { emoji: '💊', gradient: 'from-teal-500 to-cyan-500' },
  64: { emoji: '💼', gradient: 'from-gray-500 to-slate-600' },
  65: { emoji: '🏙️', gradient: 'from-indigo-500 to-violet-600' },
  66: { emoji: '👹', gradient: 'from-red-700 to-rose-800' },
  67: { emoji: '🎰', gradient: 'from-yellow-500 to-red-500' },
  68: { emoji: '🐉', gradient: 'from-green-600 to-emerald-700' },
  69: { emoji: '👨‍👩‍👧', gradient: 'from-blue-400 to-cyan-400' },
  70: { emoji: '🎯', gradient: 'from-orange-500 to-red-600' },
  71: { emoji: '⏰', gradient: 'from-cyan-500 to-blue-500' },
  72: { emoji: '🧸', gradient: 'from-pink-300 to-rose-300' },
  73: { emoji: '🎮', gradient: 'from-purple-500 to-indigo-600' },
  74: { emoji: '🎨', gradient: 'from-rose-400 to-pink-500' },
  75: { emoji: '🏢', gradient: 'from-slate-500 to-gray-600' },
  76: { emoji: '😈', gradient: 'from-purple-700 to-violet-800' },
  77: { emoji: '⚔️', gradient: 'from-amber-600 to-red-600' },
  78: { emoji: '🏅', gradient: 'from-green-500 to-teal-500' },
};

const FEATURED_IDS = [1, 2, 4, 8, 10, 14, 22, 24, 7, 36, 30, 37];

const FEATURED_GENRES = FEATURED_IDS.map((id) => ({
  id,
  ...GENRE_EMOJI_MAP[id],
}));

function getGenreStyle(genreId) {
  return GENRE_EMOJI_MAP[genreId] || { emoji: '🎬', gradient: 'from-gray-600 to-gray-700' };
}

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const selectedGenreId = searchParams.get('genre') || '';
  const [genres, setGenres] = useState([]);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');

  useEffect(() => {
    genreService.getAnimeGenres()
      .then((data) => setGenres(data.data || []))
      .catch(() => {});
  }, []);

  const fetchAnime = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 24, order_by: 'score', sort: 'desc' };
      if (selectedGenreId) params.genres = selectedGenreId;
      const data = await animeService.search(params);
      setAnime((prev) => (append ? [...prev, ...(data.data || [])] : data.data || []));
      setHasMore(data.pagination?.has_next_page || false);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedGenreId]);

  useEffect(() => {
    setAnime([]);
    fetchAnime(1);
  }, [selectedGenreId]);

  const selectedGenre = genres.find((g) => String(g.mal_id) === selectedGenreId);
  const filteredGenres = genreSearch.trim()
    ? genres.filter((g) => g.name.toLowerCase().includes(genreSearch.toLowerCase().trim()))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          {selectedGenre ? selectedGenre.name : 'Browse'} Anime
        </h1>
        <p className="text-white/40 mb-8">Explore anime by genre</p>
      </motion.div>

      {selectedGenreId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-white/60 hover:text-white transition-all"
          >
            <FiX className="w-3.5 h-3.5" />
            Clear filter: <span className="text-primary-400 font-medium">{selectedGenre?.name}</span>
          </Link>
        </motion.div>
      )}

      {!selectedGenreId && (
        <div className="mb-10">
          <div className="relative max-w-md mb-6">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="Search genres..."
              className="w-full text-sm text-white placeholder-white/30 outline-none py-2.5 pl-10 pr-4 rounded-xl"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
            />
            {genreSearch && (
              <button onClick={() => setGenreSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {genreSearch.trim() ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {filteredGenres.length === 0 ? (
                <p className="col-span-full text-center text-sm text-white/30 py-8">No genres match "{genreSearch}"</p>
              ) : (
                filteredGenres.map((genre, i) => {
                  const style = getGenreStyle(genre.mal_id);
                  return (
                    <motion.div
                      key={genre.mal_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={`/browse?genre=${genre.mal_id}`}
                        className="group block relative overflow-hidden rounded-2xl p-4 md:p-5 text-center"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-15 group-hover:opacity-30 transition-opacity duration-500`} />
                        <div className="absolute inset-0 glass" />
                        <div className="relative z-10">
                          <motion.span
                            className="text-2xl md:text-3xl block mb-1.5"
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            {style.emoji}
                          </motion.span>
                          <span className="text-xs md:text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                            {genre.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {FEATURED_IDS.map((id, i) => {
                const style = getGenreStyle(id);
                const apiGenre = genres.find((g) => g.mal_id === id);
                const name = apiGenre?.name || '';
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      to={`/browse?genre=${id}`}
                      className="group block relative overflow-hidden rounded-2xl p-4 md:p-5 text-center"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-15 group-hover:opacity-30 transition-opacity duration-500`} />
                      <div className="absolute inset-0 glass" />
                      <div className="relative z-10">
                        <motion.span
                          className="text-2xl md:text-3xl block mb-1.5"
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {style.emoji}
                        </motion.span>
                        <span className="text-xs md:text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                          {name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <InfiniteScroll
        onLoadMore={() => !loading && hasMore && fetchAnime(page + 1, true)}
        hasMore={hasMore}
        loading={loading && page > 1}
      >
        <AnimeGrid anime={anime} loading={loading && page === 1} />
      </InfiniteScroll>
    </div>
  );
}
