import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome, FiCompass, FiStar, FiTrendingUp, FiSearch, FiBookmark, FiUser, FiLogIn, FiCalendar, FiShuffle, FiGitPullRequest, FiHelpCircle, FiClock, FiSmile, FiFilm, FiMic, FiLayers, FiHeart, FiList, FiAward, FiMap, FiBarChart2, FiDownload } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/search', label: 'Search', icon: FiSearch },
  { to: '/browse', label: 'Browse', icon: FiCompass },
  { to: '/seasonal', label: 'Seasonal', icon: FiStar },
  { to: '/top', label: 'Rankings', icon: FiTrendingUp },
  { to: '/schedule', label: 'Schedule', icon: FiCalendar },
  { to: '/random', label: 'Random Picker', icon: FiShuffle },
  { to: '/compare', label: 'Compare', icon: FiGitPullRequest },
  { to: '/quiz', label: 'Quiz', icon: FiHelpCircle },
  { to: '/mood', label: 'Mood Picker', icon: FiSmile },
  { to: '/studios', label: 'Studios', icon: FiFilm },
  { to: '/trailers', label: 'Trailer Theater', icon: FiFilm },
  { to: '/voiceactors', label: 'Voice Actors', icon: FiMic },
  { to: '/tierlist', label: 'Tier List', icon: FiLayers },
  { to: '/thisorthat', label: 'This or That', icon: FiHeart },
  { to: '/watchorder', label: 'Watch Order', icon: FiList },
  { to: '/animeoftheday', label: 'Anime of the Day', icon: FiAward },
  { to: '/countdown', label: 'Episode Countdown', icon: FiClock },
  { to: '/lists', label: 'Custom Lists', icon: FiList },
  { to: '/map', label: 'Anime World Map', icon: FiMap },
  { to: '/achievements', label: 'Achievements', icon: FiAward },
  { to: '/wrapped', label: 'Year in Review', icon: FiBarChart2 },
  { to: '/export', label: 'Export Data', icon: FiDownload },
  { to: '/recent', label: 'Recently Viewed', icon: FiClock },
  { to: '/watchlist', label: 'Watchlist', icon: FiBookmark },
];

export default function MobileNav({ isOpen, onClose }) {
  const { user } = useAuthStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-dark-surface/95 backdrop-blur-2xl border-l border-white/[0.06] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <span className="text-lg font-display font-bold text-gradient">AnimeVerse</span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="p-4 border-t border-white/[0.06]">
              {user ? (
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                    <p className="text-xs text-white/40">View Profile</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-medium"
                >
                  <FiLogIn className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
