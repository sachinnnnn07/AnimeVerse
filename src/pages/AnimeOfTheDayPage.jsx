import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiHeart, FiTv, FiCalendar, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils/formatters';

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export default function AnimeOfTheDayPage() {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dayIndex = getDayOfYear();
    const page = (dayIndex % 50) + 1;

    animeService.search({ page, limit: 1, order_by: 'favorites', sort: 'desc', min_score: 7 })
      .then((data) => setAnime(data.data?.[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-64 aspect-[3/4] rounded-2xl mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) return null;

  const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const title = anime.title_english || anime.title;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4 text-sm text-white/60">
          <FiCalendar className="w-4 h-4" /> {today}
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Anime of the Day
        </h1>
        <p className="text-white/40">Today's featured anime — come back tomorrow for a new pick!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-3xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 relative">
            <div className="md:w-72">
              <img src={image} alt={title} className="w-full md:h-full object-cover" style={{ minHeight: '300px' }} />
            </div>
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold shadow-lg">
                ⭐ Today's Pick
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {anime.type && <Badge variant="primary">{anime.type}</Badge>}
              {anime.status && <Badge>{anime.status}</Badge>}
              <ScoreBadge score={anime.score} size="md" />
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{title}</h2>
            {anime.title !== title && <p className="text-sm text-white/30 mb-4">{anime.title}</p>}

            {anime.synopsis && (
              <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-[6]">
                {anime.synopsis}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiTv className="w-4 h-4 text-primary-400" />
                {anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiUsers className="w-4 h-4 text-neon-blue" />
                {formatNumber(anime.members)} Members
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiHeart className="w-4 h-4 text-accent-400" />
                {formatNumber(anime.favorites)} Favorites
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiStar className="w-4 h-4 text-yellow-400" />
                Ranked #{anime.rank || 'N/A'}
              </div>
            </div>

            {anime.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {anime.genres.map((g) => (
                  <Link key={g.mal_id} to={`/browse?genre=${g.mal_id}`} className="px-2.5 py-1 rounded-full glass text-xs text-white/60 hover:text-white transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              to={`/anime/${anime.mal_id}`}
              className="btn-primary inline-flex items-center gap-2 text-sm relative z-10"
            >
              <FiExternalLink className="w-4 h-4 relative z-10" />
              <span className="relative z-10">View Full Details</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
