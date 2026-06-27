import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link to="/" className="text-sm font-display font-bold text-gradient">
            AnimeVerse
          </Link>
          <div className="flex items-center gap-4 text-[11px] text-white/30">
            <Link to="/browse" className="hover:text-white/60 transition-colors">Browse</Link>
            <Link to="/seasonal" className="hover:text-white/60 transition-colors">Seasonal</Link>
            <Link to="/top" className="hover:text-white/60 transition-colors">Rankings</Link>
            <span>Powered by Jikan API</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-white/25">
            Made with <FiHeart className="w-2.5 h-2.5 text-primary-500" /> for anime fans
          </span>
        </div>
      </div>
    </footer>
  );
}
