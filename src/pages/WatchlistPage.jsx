import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookmark, FiPlay, FiCheck, FiClock, FiPause, FiX, FiLogIn } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';
import useWatchlistStore from '@/store/useWatchlistStore';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { WATCHLIST_STATUSES } from '@/utils/constants';

const statusIcons = {
  watching: FiPlay,
  completed: FiCheck,
  plan_to_watch: FiClock,
  on_hold: FiPause,
  dropped: FiX,
};

export default function WatchlistPage() {
  const { user } = useAuthStore();
  const { items, getByStatus } = useWatchlistStore();
  const [activeTab, setActiveTab] = useState('all');

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <FiBookmark className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Your Watchlist Awaits</h2>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">
            Sign in to start tracking your anime journey. Save anime, rate them, and never lose track.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center gap-2 relative z-10"
          >
            <FiLogIn className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Sign In to Continue</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const filteredItems = activeTab === 'all' ? items : getByStatus(activeTab);

  const animeList = filteredItems.map((item) => ({
    mal_id: item.animeId,
    title: item.title,
    images: { jpg: { large_image_url: item.imageUrl } },
    type: item.type,
    episodes: item.episodes,
    score: item.score,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-white/40 mb-8">{items.length} anime in your collection</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
              : 'glass text-white/50 hover:text-white/80'
          }`}
        >
          All <span className="text-xs opacity-60">{items.length}</span>
        </button>
        {WATCHLIST_STATUSES.map((status) => {
          const count = getByStatus(status.value).length;
          const Icon = statusIcons[status.value];
          return (
            <button
              key={status.value}
              onClick={() => setActiveTab(status.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === status.value
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                  : 'glass text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {status.label}
              {count > 0 && <span className="text-xs opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📚</span>
          <h3 className="text-xl font-display font-bold text-white/80 mb-2">
            {activeTab === 'all' ? 'Your watchlist is empty' : `No anime in ${activeTab.replace('_', ' ')}`}
          </h3>
          <p className="text-white/40 mb-6">Start browsing to add anime to your watchlist</p>
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
