import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiStar, FiBookmark } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import ScoreBadge from '@/components/ui/ScoreBadge';

export default function AnimeCard({ anime, index = 0 }) {
  if (!anime) return null;

  const title = anime.title_english || anime.title;
  const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/anime/${anime.mal_id}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-primary-500/30 group-hover:shadow-2xl group-hover:shadow-primary-500/10" style={{ backgroundColor: 'var(--dark-card-bg)', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105"
              style={{ transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
              >
                <FiPlay className="w-6 h-6 text-white ml-0.5" />
              </motion.div>
            </div>

            {anime.score && (
              <div className="absolute top-2 right-2">
                <ScoreBadge score={anime.score} />
              </div>
            )}

            {anime.type && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md bg-dark/70 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white/80 border border-white/10">
                  {anime.type}
                </span>
              </div>
            )}

            {anime.episodes && (
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-2 py-0.5 rounded-md bg-dark/70 backdrop-blur-sm text-[10px] font-medium text-white/70">
                  {anime.episodes} eps
                </span>
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-white transition-colors leading-snug">
              {title}
            </h3>
            {anime.genres && anime.genres.length > 0 && (
              <p className="mt-1.5 text-[11px] text-white/30 truncate">
                {anime.genres.slice(0, 3).map((g) => g.name).join(' · ')}
              </p>
            )}
          </div>

          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-primary-500/20 transition-all pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
