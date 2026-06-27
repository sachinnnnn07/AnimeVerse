import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiTv } from 'react-icons/fi';
import { cachedGet } from '@/services/api/jikanClient';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[getTodayIndex()]);

  useEffect(() => {
    setLoading(true);
    cachedGet('/schedules', { filter: activeDay, sfw: true, limit: 25 })
      .then((data) => {
        setSchedule((prev) => ({ ...prev, [activeDay]: data.data || [] }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeDay]);

  const animeList = schedule[activeDay] || [];
  const todayIndex = getTodayIndex();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Airing Schedule
        </h1>
        <p className="text-white/40 mb-8">See what's airing each day of the week</p>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeDay === day
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                : 'glass text-white/50 hover:text-white/80'
            }`}
          >
            {DAY_LABELS[i]}
            {i === todayIndex && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {activeDay === DAYS[todayIndex] && (
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Today's Schedule
          </span>
        </div>
      )}

      <p className="text-sm text-white/40 mb-6">{loading ? 'Loading...' : `${animeList.length} anime airing on ${DAY_LABELS[DAYS.indexOf(activeDay)]}`}</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 glass rounded-2xl p-4">
              <Skeleton className="w-14 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {animeList.map((anime, i) => {
            const image = anime.images?.webp?.image_url || anime.images?.jpg?.image_url;
            const title = anime.title_english || anime.title;
            return (
              <motion.div
                key={anime.mal_id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/anime/${anime.mal_id}`}
                  className="flex items-center gap-4 glass rounded-2xl p-4 glass-hover"
                >
                  <img src={image} alt={title} className="w-14 h-20 rounded-xl object-cover border border-white/10" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-white truncate">{title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {anime.broadcast?.time && (
                        <Badge variant="neon"><FiClock className="w-3 h-3" /> {anime.broadcast.time} JST</Badge>
                      )}
                      {anime.episodes && <Badge><FiTv className="w-3 h-3" /> {anime.episodes} eps</Badge>}
                      {anime.genres?.slice(0, 2).map((g) => (
                        <Badge key={g.mal_id}>{g.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <ScoreBadge score={anime.score} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
