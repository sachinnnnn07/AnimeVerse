import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiBookmark, FiUser, FiLogIn, FiMoreHorizontal } from 'react-icons/fi';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import useAuthStore from '@/store/useAuthStore';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/utils/cn';
import MobileNav from './MobileNav';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/seasonal', label: 'Seasonal' },
  { to: '/top', label: 'Rankings' },
];

const megaMenu = [
  {
    title: 'Discover',
    links: [
      { to: '/schedule', emoji: '📅', label: 'Schedule' },
      { to: '/mood', emoji: '🎭', label: 'Mood Picker' },
      { to: '/studios', emoji: '🎬', label: 'Studios' },
      { to: '/trailers', emoji: '🎥', label: 'Trailers' },
      { to: '/voiceactors', emoji: '🎙️', label: 'Voice Actors' },
      { to: '/animeoftheday', emoji: '⭐', label: 'Anime of Day' },
      { to: '/watchorder', emoji: '📋', label: 'Watch Order' },
    ],
  },
  {
    title: 'Games',
    locked: true,
    links: [
      { to: '/random', emoji: '🎲', label: 'Random Picker' },
      { to: '/compare', emoji: '⚖️', label: 'Compare' },
      { to: '/tierlist', emoji: '📊', label: 'Tier List' },
      { to: '/thisorthat', emoji: '❤️', label: 'This or That' },
      { to: '/quiz', emoji: '🧠', label: 'Quiz' },
    ],
  },
  {
    title: 'Your Stuff',
    locked: true,
    links: [
      { to: '/lists', emoji: '📝', label: 'Custom Lists' },
      { to: '/countdown', emoji: '⏰', label: 'Countdown' },
      { to: '/achievements', emoji: '🏅', label: 'Achievements' },
      { to: '/wrapped', emoji: '📊', label: 'Year in Review' },
      { to: '/map', emoji: '🗺️', label: 'World Map' },
      { to: '/export', emoji: '💾', label: 'Export' },
      { to: '/recent', emoji: '🕐', label: 'Recent' },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const scrollY = useScrollPosition();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const scrolled = scrollY > 20;
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setSuggestionsVisible(false);
    }
  };

  const handleSuggestionSelect = () => {
    setSearchQuery('');
    setSearchOpen(false);
    setSuggestionsVisible(false);
  };

  const { handleKeyDown, dropdown } = SearchSuggestions({
    query: searchQuery,
    onSelect: handleSuggestionSelect,
    visible: suggestionsVisible,
  });

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/10'
            : 'bg-transparent'
        )}
        style={scrolled ? { backgroundColor: 'var(--nav-bg)' } : undefined}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-display font-bold text-white text-sm group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                  AV
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
              <span className="text-xl font-display font-bold text-gradient hidden sm:block">
                AnimeVerse
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                      isActive
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                    moreOpen ? 'text-white bg-white/5' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  )}
                >
                  More <FiMoreHorizontal className="inline w-4 h-4 ml-0.5" />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full right-0 mt-3 glass-strong rounded-2xl overflow-hidden z-20 shadow-2xl shadow-black/40 p-4"
                        style={{ width: '540px' }}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {megaMenu.map((section) => {
                            const needsAuth = section.locked && !user;
                            return (
                            <div key={section.title}>
                              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                                {section.title}
                                {needsAuth && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary-500/15 text-primary-400 font-semibold normal-case tracking-normal">Sign in</span>}
                              </h4>
                              <div className="space-y-0.5">
                                {section.links.map((link) => (
                                  <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMoreOpen(false)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] text-white/55 hover:text-white hover:bg-white/5 transition-all"
                                  >
                                    <span className="text-sm">{link.emoji}</span>
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    ref={searchWrapperRef}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="relative overflow-visible"
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSuggestionsVisible(true);
                        }}
                        onFocus={() => setSuggestionsVisible(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search anime..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-primary-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </form>
                    {dropdown}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) {
                    setSearchQuery('');
                    setSuggestionsVisible(false);
                  }
                }}
                className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                {searchOpen ? <FiX className="w-5 h-5" /> : <FiSearch className="w-5 h-5" />}
              </button>

              <ThemeToggle />

              {user ? (
                <>
                  <Link
                    to="/watchlist"
                    className="hidden sm:flex p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <FiBookmark className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <FiUser className="w-4 h-4 text-white/60" />
                    )}
                    <span className="text-sm text-white/80 max-w-[80px] truncate">
                      {user.displayName || 'Profile'}
                    </span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  <FiLogIn className="w-4 h-4" /> Sign In
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
