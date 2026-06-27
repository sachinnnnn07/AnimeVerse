import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiLock } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';

export default function RequireAuth({ children, feature }) {
  const { user } = useAuthStore();

  if (user) return children;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <FiLock className="w-8 h-8 text-primary-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Sign In Required
        </h2>
        <p className="text-white/40 mb-6">
          {feature
            ? `Sign in to access ${feature}. It's free and takes seconds!`
            : "Sign in to access this feature. It's free and takes seconds!"}
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
