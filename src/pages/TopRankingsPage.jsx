import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { topService } from '@/services/api/topService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils/formatters';
import { TOP_FILTERS } from '@/utils/constants';

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-2xl font-black text-gradient-gold font-display">1</span>;
  if (rank === 2) return <span className="text-2xl font-black text-gray-300 font-display">2</span>;
  if (rank === 3) return <span className="text-2xl font-black text-amber-600 font-display">3</span>;
  return <span className="text-lg font-bold text-white/30 font-display">{rank}</span>;
}

export default function TopRankingsPage() {
  const [filter, setFilter] = useState('');
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const params = { page, limit: 25 };
      if (filter) params.filter = filter;
      try {
        const data = await topService.getTopAnime(params);
        if (!cancelled) {
          setAnime(data.data || []);
          setTotalPages(data.pagination?.last_visible_page || 1);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLoading(false);
        }
      }
    })();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { cancelled = true; };
  }, [filter, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Top Anime Rankings
        </h1>
        <p className="text-white/40 mb-8">The best anime ranked by the community</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TOP_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                : 'glass text-white/50 hover:text-white/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 glass rounded-2xl p-4">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-16 h-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))
          : anime.map((item, i) => {
              const rank = (page - 1) * 25 + i + 1;
              const image = item.images?.webp?.image_url || item.images?.jpg?.image_url;
              const title = item.title_english || item.title;

              return (
                <motion.div
                  key={item.mal_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/anime/${item.mal_id}`}
                    className={`flex items-center gap-4 glass rounded-2xl p-4 glass-hover ${
                      rank <= 3 ? 'border-primary-500/20' : ''
                    }`}
                  >
                    <div className="w-10 text-center flex-shrink-0">
                      <RankBadge rank={rank} />
                    </div>

                    <img
                      src={image}
                      alt={title}
                      className="w-14 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-white truncate">{title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {item.type && <Badge>{item.type}</Badge>}
                        {item.episodes && (
                          <span className="text-xs text-white/30">{item.episodes} eps</span>
                        )}
                        {item.aired?.prop?.from?.year && (
                          <span className="text-xs text-white/30">{item.aired.prop.from.year}</span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-bold text-white">
                          <FiUsers className="w-3.5 h-3.5 text-white/30" />
                          {formatNumber(item.members)}
                        </div>
                        <span className="text-[10px] text-white/30">members</span>
                      </div>
                      <ScoreBadge score={item.score} size="md" />
                    </div>

                    <div className="sm:hidden flex-shrink-0">
                      <ScoreBadge score={item.score} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl glass text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 text-sm text-white/60">
            Page <span className="font-bold text-white">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl glass text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
