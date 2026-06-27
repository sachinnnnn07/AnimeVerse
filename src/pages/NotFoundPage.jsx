import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-8xl mb-6"
        >
          🌌
        </motion.div>
        <h1 className="text-6xl font-display font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Lost in the Anime Universe</h2>
        <p className="text-white/40 mb-8 max-w-md mx-auto">
          This page seems to have wandered into another dimension. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/" className="btn-primary flex items-center gap-2 relative z-10">
            <FiHome className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Go Home</span>
          </Link>
          <Link to="/search" className="btn-glass flex items-center gap-2">
            <FiSearch className="w-4 h-4" /> Search Anime
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
