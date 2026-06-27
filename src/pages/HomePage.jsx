import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiCompass, FiStar, FiArrowRight, FiPlay } from 'react-icons/fi';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import AnimeGrid from '@/components/anime/AnimeGrid';
import SectionHeader from '@/components/common/SectionHeader';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import { topService } from '@/services/api/topService';
import { seasonService } from '@/services/api/seasonService';
import { genreService } from '@/services/api/genreService';
import { getCurrentSeason, capitalizeFirst } from '@/utils/formatters';


function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topAnime, setTopAnime] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
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

  const { handleKeyDown: suggestionsKeyDown, dropdown: suggestionsDropdown } = SearchSuggestions({
    query: searchQuery,
    onSelect: () => { setSearchQuery(''); setSuggestionsVisible(false); },
    visible: suggestionsVisible,
  });

  useEffect(() => {
    topService.getTopAnime({ limit: 20, filter: 'airing' })
      .then((data) => setTopAnime(data.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm text-white/70"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Discover {topAnime.length > 0 ? 'thousands of' : 'amazing'} anime
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
              <span className="text-white">Your </span>
              <span className="text-gradient">Anime Universe</span>
              <br />
              <span className="text-white">Awaits</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 mb-8 max-w-xl leading-relaxed">
              Explore, discover, and track anime like never before. Get personalized
              recommendations, create watchlists, and join a community of anime fans.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative max-w-xl mb-8"
            ref={searchWrapperRef}
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 blur transition-opacity duration-500" />
              <div className="relative flex items-center">
                <FiSearch className="absolute left-4 w-5 h-5 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestionsVisible(true);
                  }}
                  onFocus={() => setSuggestionsVisible(true)}
                  onKeyDown={suggestionsKeyDown}
                  placeholder="Search for anime..."
                  className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-32 py-4 text-white placeholder-white/30 outline-none focus:border-primary-500/40 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  Search
                </button>
              </div>
            </div>
            {suggestionsDropdown}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/browse"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-white/70 hover:text-white"
            >
              <FiCompass className="w-4 h-4 text-primary-400" />
              Explore
              <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/top"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-white/70 hover:text-white"
            >
              <FiTrendingUp className="w-4 h-4 text-accent-400" />
              Top Ranked
            </Link>
            <Link
              to="/seasonal"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-white/70 hover:text-white"
            >
              <FiStar className="w-4 h-4 text-neon-blue" />
              This Season
            </Link>
          </motion.div>
        </div>

        {topAnime.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden lg:flex absolute right-4 xl:right-12 top-0 bottom-0 gap-3 items-center overflow-hidden"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
          >
            {[0, 1, 2].map((colIdx) => {
              const start = colIdx * 6;
              const colAnime = topAnime.slice(start, start + 6).length > 0
                ? topAnime.slice(start, start + 6)
                : topAnime.slice(0, 6);
              const direction = colIdx === 1 ? 'down' : 'up';
              const speed = colIdx === 1 ? 35 : colIdx === 0 ? 30 : 40;
              return (
                <div
                  key={colIdx}
                  className="flex flex-col gap-3 w-32 xl:w-36"
                  style={{
                    animation: `scroll-${direction} ${speed}s linear infinite`,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {[...colAnime, ...colAnime].map((anime, i) => {
                    const img = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
                    return (
                      <Link
                        key={`${anime.mal_id}-${colIdx}-${i}`}
                        to={`/anime/${anime.mal_id}`}
                        className="block flex-shrink-0 rounded-xl overflow-hidden border border-white/[0.06] hover:border-primary-500/30 transition-all group"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}


export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState({ trending: true, seasonal: true, top: true, upcoming: true });

  const { season, year } = getCurrentSeason();

  useEffect(() => {
    topService.getTopAnime({ filter: 'airing', limit: 15 })
      .then((data) => setTrending(data.data || []))
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, trending: false })));

    seasonService.getCurrentSeason({ limit: 12 })
      .then((data) => setSeasonal(data.data || []))
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, seasonal: false })));

    topService.getTopAnime({ limit: 12 })
      .then((data) => setTopRated(data.data || []))
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, top: false })));

    topService.getTopAnime({ filter: 'upcoming', limit: 15 })
      .then((data) => setUpcoming(data.data || []))
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, upcoming: false })));
  }, []);

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24 pb-12">
        <section>
          <SectionHeader
            title="Trending Now"
            subtitle="Most popular anime currently airing"
            link="/top?filter=airing"
          />
          <AnimeCarousel anime={trending} loading={loading.trending} />
        </section>

        <section>
          <SectionHeader
            title={`${capitalizeFirst(season)} ${year} Anime`}
            subtitle="This season's lineup"
            link="/seasonal"
          />
          <AnimeGrid anime={seasonal.slice(0, 12)} loading={loading.seasonal} />
        </section>

        <section>
          <SectionHeader
            title="Upcoming Anime"
            subtitle="Most anticipated anime coming soon"
            link="/top?filter=upcoming"
          />
          <AnimeCarousel anime={upcoming} loading={loading.upcoming} />
        </section>

        <section>
          <SectionHeader
            title="Top Rated of All Time"
            subtitle="The highest rated anime ever"
            link="/top"
          />
          <AnimeCarousel anime={topRated} loading={loading.top} />
        </section>

        <section>
          <SectionHeader title="Explore More" subtitle="Fun tools to enhance your anime experience" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { to: '/random', emoji: '🎲', label: 'Random Picker', desc: "Can't decide? Let fate choose" },
              { to: '/compare', emoji: '⚔️', label: 'Compare', desc: 'Battle of the anime' },
              { to: '/quiz', emoji: '🧠', label: 'Anime Quiz', desc: 'Test your knowledge' },
              { to: '/schedule', emoji: '📅', label: 'Schedule', desc: "What's airing today" },
            ].map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={item.to}
                  className="group block p-5 rounded-2xl glass glass-hover text-center"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-125 transition-transform duration-300">
                    {item.emoji}
                  </span>
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors block">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-white/30 mt-1 block">{item.desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Create an account to build your watchlist, write reviews, and get personalized recommendations.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="btn-primary flex items-center gap-2 relative z-10"
              >
                <span className="relative z-10">Get Started Free</span>
              </Link>
              <Link to="/browse" className="btn-glass flex items-center gap-2">
                Browse Anime
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
