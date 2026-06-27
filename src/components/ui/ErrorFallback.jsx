import { FiRefreshCw, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ErrorFallback({ error, resetErrorBoundary, message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 flex items-center justify-center animate-pulse-glow">
          <span className="text-5xl">😵</span>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 blur-3xl rounded-full" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 font-display">
        {message || 'Something went wrong'}
      </h2>
      <p className="text-white/50 mb-8 max-w-md">
        {error?.message || "Don't worry, this happens sometimes. Try refreshing or head back home."}
      </p>

      <div className="flex gap-4">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="btn-primary flex items-center gap-2 relative z-10"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span className="relative z-10">Try Again</span>
          </button>
        )}
        <Link to="/" className="btn-glass flex items-center gap-2">
          <FiHome className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
