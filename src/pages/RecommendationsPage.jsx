import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiLogIn, FiTrendingUp } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import AnimeGrid from '@/components/anime/AnimeGrid';
import SectionHeader from '@/components/common/SectionHeader';
import { topService } from '@/services/api/topService';
import { seasonService } from '@/services/api/seasonService';

export default function RecommendationsPage() {
  const { user } = useAuthStore();
  const [trending, setTrending] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      topService.getTopAnime({ filter: 'airing', limit: 15 }),
      seasonService.getCurrentSeason({ limit: 12 }),
      topService.getTopAnime({ limit: 15 }),
    ])
      .then(([trendingData, seasonalData, topData]) => {
        setTrending(trendingData.data || []);
        setSeasonal(seasonalData.data || []);
        setTopRated(topData.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <FiZap className="w-8 h-8 text-neon-blue" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Personalized Recommendations</h2>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">
            Sign in and build your watchlist to get AI-powered anime recommendations tailored just for you.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center gap-2 relative z-10"
          >
            <FiLogIn className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Sign In to Get Started</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Recommended For You
        </h1>
        <p className="text-white/40">Based on your viewing history and preferences</p>
      </motion.div>

      <section>
        <SectionHeader title="Trending Now" subtitle="Popular anime everyone's watching" link="/top?filter=airing" />
        <AnimeCarousel anime={trending} loading={loading} />
      </section>

      <section>
        <SectionHeader title="This Season's Best" subtitle="Don't miss these seasonal picks" link="/seasonal" />
        <AnimeGrid anime={seasonal.slice(0, 12)} loading={loading} />
      </section>

      <section>
        <SectionHeader title="All-Time Classics" subtitle="Highest rated anime of all time" link="/top" />
        <AnimeCarousel anime={topRated} loading={loading} />
      </section>
    </div>
  );
}
