import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiBookmark, FiStar, FiClock, FiTv, FiLogIn, FiLogOut } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';
import useWatchlistStore from '@/store/useWatchlistStore';
import { formatNumber } from '@/utils/formatters';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-bold text-white font-display">{value}</div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { items } = useWatchlistStore();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Your Profile</h2>
          <p className="text-white/40 mb-6">Sign in to view your anime profile and stats</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 relative z-10">
            <FiLogIn className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Sign In</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const watching = items.filter((i) => i.status === 'watching').length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const totalEpisodes = items.reduce((sum, i) => sum + (i.episodesWatched || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 mb-8 text-center"
      >
        <div className="relative inline-block mb-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-24 h-24 rounded-full border-2 border-primary-500/30" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {(user.displayName || user.email)?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className="absolute -inset-2 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-lg -z-10" />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-1">
          {user.displayName || 'Anime Fan'}
        </h1>
        <p className="text-sm text-white/40 mb-6">{user.email}</p>

        <button
          onClick={() => logout()}
          className="btn-glass inline-flex items-center gap-2 text-sm text-red-400 border-red-500/20 hover:border-red-500/40"
        >
          <FiLogOut className="w-4 h-4" /> Sign Out
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiBookmark} label="Total Anime" value={items.length} color="text-primary-400" />
        <StatCard icon={FiTv} label="Watching" value={watching} color="text-green-400" />
        <StatCard icon={FiStar} label="Completed" value={completed} color="text-blue-400" />
        <StatCard icon={FiClock} label="Episodes" value={formatNumber(totalEpisodes)} color="text-accent-400" />
      </div>

      <div className="text-center">
        <Link
          to="/watchlist"
          className="btn-primary inline-flex items-center gap-2 relative z-10"
        >
          <FiBookmark className="w-4 h-4 relative z-10" />
          <span className="relative z-10">View Watchlist</span>
        </Link>
      </div>
    </div>
  );
}
