import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { seasonService } from '@/services/api/seasonService';
import { getCurrentSeason, capitalizeFirst } from '@/utils/formatters';
import { SEASONS } from '@/utils/constants';

export default function SeasonalPage() {
  const current = getCurrentSeason();
  const [year, setYear] = useState(current.year);
  const [season, setSeason] = useState(current.season);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeasonal = useCallback(async () => {
    setLoading(true);
    try {
      const data = await seasonService.getSeason(year, season, { limit: 25 });
      setAnime(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, season]);

  useEffect(() => {
    fetchSeasonal();
  }, [fetchSeasonal]);

  const navigateSeason = (direction) => {
    const idx = SEASONS.indexOf(season);
    if (direction === 1) {
      if (idx === 3) { setSeason('winter'); setYear(year + 1); }
      else setSeason(SEASONS[idx + 1]);
    } else {
      if (idx === 0) { setSeason('fall'); setYear(year - 1); }
      else setSeason(SEASONS[idx - 1]);
    }
  };

  const isCurrent = year === current.year && season === current.season;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
          Seasonal Anime
        </h1>
      </motion.div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => navigateSeason(-1)}
          className="p-2.5 rounded-xl glass text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  s === season
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {capitalizeFirst(s)}
              </button>
            ))}
          </div>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary-500/40 [&>option]:bg-dark-surface"
          >
            {Array.from({ length: 10 }, (_, i) => current.year + 1 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigateSeason(1)}
          className="p-2.5 rounded-xl glass text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isCurrent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Current Season
          </span>
        </motion.div>
      )}

      <p className="text-sm text-white/40 mb-6">{anime.length} anime found</p>

      <AnimeGrid anime={anime} loading={loading} />
    </div>
  );
}
