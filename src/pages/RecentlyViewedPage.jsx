import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import useRecentStore from '@/store/useRecentStore';
import AnimeGrid from '@/components/anime/AnimeGrid';

export default function RecentlyViewedPage() {
  const { items, clearAll } = useRecentStore();

  const animeList = items.map((item) => ({
    mal_id: item.mal_id,
    title: item.title,
    title_english: item.title,
    images: { jpg: { large_image_url: item.image }, webp: { large_image_url: item.image } },
    type: item.type,
    score: item.score,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Recently Viewed
          </h1>
          <p className="text-white/40">{items.length} anime in your history</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="btn-glass flex items-center gap-2 text-sm text-red-400 border-red-500/20 hover:border-red-500/40"
          >
            <FiTrash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <FiClock className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-display font-bold text-white/80 mb-2">No viewing history yet</h3>
          <p className="text-white/40 mb-6">Start browsing anime to build your history</p>
          <Link to="/browse" className="btn-primary inline-flex items-center gap-2 relative z-10">
            <span className="relative z-10">Browse Anime</span>
          </Link>
        </div>
      ) : (
        <AnimeGrid anime={animeList} />
      )}
    </div>
  );
}
