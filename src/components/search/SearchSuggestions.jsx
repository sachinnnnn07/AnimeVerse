import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import { useDebounce } from '@/hooks/useDebounce';
import { getScoreColor } from '@/utils/formatters';

export default function SearchSuggestions({ query, onSelect, visible = true }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const listRef = useRef(null);

  useEffect(() => {
    setActiveIndex(-1);
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    animeService
      .search({ q: debouncedQuery.trim(), limit: 6, order_by: 'popularity', sort: 'asc' })
      .then((data) => {
        const q = debouncedQuery.toLowerCase().trim();
        const filtered = (data.data || []).filter((a) => {
          const titles = [a.title, a.title_english, a.title_japanese, ...(a.title_synonyms || [])].filter(Boolean);
          return titles.some((t) => t.toLowerCase().includes(q));
        });
        setSuggestions(filtered.slice(0, 5));
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onSelect?.(suggestions[activeIndex]);
    }
  };

  const show = visible && (suggestions.length > 0 || loading) && debouncedQuery?.trim().length >= 2;

  return {
    handleKeyDown,
    dropdown: (
      <AnimatePresence>
        {show && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-50 shadow-2xl shadow-black/40"
          >
            {loading ? (
              <div className="px-4 py-3 text-sm text-white/40 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-primary-400 animate-spin" />
                  Searching...
                </div>
              </div>
            ) : (
              suggestions.map((anime, i) => {
                const image = anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url;
                const title = anime.title_english || anime.title;
                return (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    onClick={() => onSelect?.(anime)}
                    className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                      i === activeIndex
                        ? 'bg-primary-500/15 border-l-2 border-primary-500'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-10 h-14 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {anime.type && (
                          <span className="text-[10px] text-white/30 uppercase font-medium">{anime.type}</span>
                        )}
                        {anime.aired?.prop?.from?.year && (
                          <span className="text-[10px] text-white/30">{anime.aired.prop.from.year}</span>
                        )}
                        {anime.score && (
                          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${getScoreColor(anime.score)}`}>
                            <FiStar className="w-2.5 h-2.5" />
                            {anime.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    ),
  };
}
