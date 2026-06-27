import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiExternalLink, FiStar, FiTv, FiCalendar } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { formatNumber } from '@/utils/formatters';

const WHEEL_COLORS = [
  'from-primary-600 to-primary-500',
  'from-accent-600 to-accent-500',
  'from-neon-blue/80 to-cyan-500',
  'from-emerald-600 to-green-500',
  'from-amber-600 to-yellow-500',
  'from-rose-600 to-pink-500',
  'from-violet-600 to-purple-500',
  'from-indigo-600 to-blue-500',
];

export default function RandomPickerPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [candidates, setCandidates] = useState([]);

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const newRotation = rotation + 1440 + Math.random() * 720;
    setRotation(newRotation);

    try {
      const randomPage = Math.floor(Math.random() * 200) + 1;
      const data = await animeService.search({ page: randomPage, limit: 1, order_by: 'popularity', sort: 'asc', min_score: 6 });
      const anime = data.data?.[0];

      setTimeout(() => {
        setResult(anime || null);
        setSpinning(false);
      }, 3000);
    } catch {
      const data = await animeService.search({ page: 1, limit: 25, order_by: 'score', sort: 'desc' });
      const list = data.data || [];
      const anime = list[Math.floor(Math.random() * list.length)];
      setTimeout(() => {
        setResult(anime || null);
        setSpinning(false);
      }, 3000);
    }
  };

  const image = result?.images?.webp?.large_image_url || result?.images?.jpg?.large_image_url;
  const title = result?.title_english || result?.title;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Random Anime Picker
        </h1>
        <p className="text-white/40">Can't decide what to watch? Let fate choose for you!</p>
      </motion.div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-full relative"
            style={{ transformOrigin: 'center' }}
          >
            {WHEEL_COLORS.map((color, i) => {
              const angle = (360 / WHEEL_COLORS.length) * i;
              return (
                <div
                  key={i}
                  className={`absolute inset-0 rounded-full overflow-hidden`}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 22.5) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 22.5) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + 22.5) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 22.5) * Math.PI / 180)}%)`,
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${color}`} />
                </div>
              );
            })}
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-[35%] rounded-full bg-dark-surface border-2 border-white/10 flex items-center justify-center">
              <span className="text-2xl">{spinning ? '🎲' : '🎯'}</span>
            </div>
          </motion.div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white/80 z-10" />

          {spinning && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ['0 0 30px rgba(139,92,246,0.3)', '0 0 60px rgba(236,72,153,0.4)', '0 0 30px rgba(139,92,246,0.3)'] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        <motion.button
          onClick={spin}
          disabled={spinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
        >
          <motion.div animate={spinning ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: spinning ? Infinity : 0, ease: 'linear' }}>
            <FiRefreshCw className="w-5 h-5 relative z-10" />
          </motion.div>
          <span className="relative z-10">{spinning ? 'Spinning...' : 'Spin the Wheel!'}</span>
        </motion.button>

        <AnimatePresence>
          {result && !spinning && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg"
            >
              <div className="glass-strong rounded-3xl p-6 text-center">
                <p className="text-sm text-primary-400 font-medium mb-4 uppercase tracking-wider">Your anime destiny</p>

                <Link to={`/anime/${result.mal_id}`} className="group block">
                  <div className="relative mx-auto w-48 mb-4">
                    <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/30 to-accent-500/30 blur-xl rounded-3xl" />
                    <img
                      src={image}
                      alt={title}
                      className="relative w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 group-hover:border-primary-500/30 transition-all"
                    />
                  </div>

                  <h2 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gradient transition-all">
                    {title}
                  </h2>
                </Link>

                <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
                  {result.type && <Badge variant="primary">{result.type}</Badge>}
                  {result.episodes && <Badge><FiTv className="w-3 h-3" /> {result.episodes} eps</Badge>}
                  {result.year && <Badge><FiCalendar className="w-3 h-3" /> {result.year}</Badge>}
                  <ScoreBadge score={result.score} size="md" />
                </div>

                {result.synopsis && (
                  <p className="text-sm text-white/50 line-clamp-3 mb-4">{result.synopsis}</p>
                )}

                <div className="flex items-center justify-center gap-3">
                  <Link
                    to={`/anime/${result.mal_id}`}
                    className="btn-primary flex items-center gap-2 text-sm relative z-10"
                  >
                    <FiExternalLink className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">View Details</span>
                  </Link>
                  <button onClick={spin} className="btn-glass flex items-center gap-2 text-sm">
                    <FiRefreshCw className="w-4 h-4" /> Spin Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
