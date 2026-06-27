import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiStar, FiUsers, FiHeart, FiTv, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import { useDebounce } from '@/hooks/useDebounce';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { formatNumber, getScoreColor } from '@/utils/formatters';

function AnimeSearchSelect({ label, selected, onSelect, onClear }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return; }
    setSearching(true);
    animeService.search({ q: debouncedQuery, limit: 5, order_by: 'popularity', sort: 'asc' })
      .then((data) => setResults(data.data || []))
      .catch(() => {})
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  if (selected) {
    const image = selected.images?.webp?.large_image_url || selected.images?.jpg?.large_image_url;
    return (
      <div className="glass-strong rounded-2xl p-4 text-center relative">
        <button onClick={onClear} className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
          <FiX className="w-4 h-4" />
        </button>
        <img src={image} alt={selected.title} className="w-32 aspect-[3/4] object-cover rounded-xl mx-auto mb-3 border border-white/10" />
        <h3 className="text-sm font-bold text-white truncate">{selected.title_english || selected.title}</h3>
        <ScoreBadge score={selected.score} size="md" className="mt-2" />
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl p-6 text-center">
      <p className="text-sm text-white/40 mb-3">{label}</p>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-primary-500/40 transition-all"
        />
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-20 shadow-xl">
            {results.map((anime) => (
              <button
                key={anime.mal_id}
                onClick={() => { onSelect(anime); setQuery(''); setResults([]); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
              >
                <img src={anime.images?.webp?.small_image_url} alt="" className="w-8 h-11 rounded object-cover" />
                <span className="text-sm text-white/80 truncate flex-1">{anime.title_english || anime.title}</span>
                <ScoreBadge score={anime.score} />
              </button>
            ))}
          </div>
        )}
        {searching && <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl p-3 text-center text-sm text-white/40">Searching...</div>}
      </div>
    </div>
  );
}

function ComparisonRow({ label, icon: Icon, leftValue, rightValue, highlight = 'higher', format = 'text' }) {
  const leftNum = typeof leftValue === 'number' ? leftValue : parseFloat(leftValue);
  const rightNum = typeof rightValue === 'number' ? rightValue : parseFloat(rightValue);
  const leftWins = highlight === 'higher' ? leftNum > rightNum : leftNum < rightNum;
  const rightWins = highlight === 'higher' ? rightNum > leftNum : rightNum < leftNum;

  const formatVal = (v) => {
    if (v == null || v === undefined) return 'N/A';
    if (format === 'number') return formatNumber(v);
    if (format === 'score') return typeof v === 'number' ? v.toFixed(1) : v;
    return String(v);
  };

  return (
    <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-white/[0.04]">
      <div className={`text-right text-sm font-medium ${leftWins ? 'text-green-400' : 'text-white/60'}`}>
        {formatVal(leftValue)}
        {leftWins && <span className="ml-1 text-[10px]">✓</span>}
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-white/40">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className={`text-left text-sm font-medium ${rightWins ? 'text-green-400' : 'text-white/60'}`}>
        {rightWins && <span className="mr-1 text-[10px]">✓</span>}
        {formatVal(rightValue)}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [animeA, setAnimeA] = useState(null);
  const [animeB, setAnimeB] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Anime Comparison
        </h1>
        <p className="text-white/40">Compare two anime side by side</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start mb-10">
        <AnimeSearchSelect label="Select first anime" selected={animeA} onSelect={setAnimeA} onClear={() => setAnimeA(null)} />
        <div className="hidden md:flex items-center justify-center h-full">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/30 font-bold">VS</div>
        </div>
        <AnimeSearchSelect label="Select second anime" selected={animeB} onSelect={setAnimeB} onClear={() => setAnimeB(null)} />
      </div>

      <AnimatePresence>
        {animeA && animeB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-strong rounded-2xl p-6"
          >
            <h2 className="text-lg font-display font-bold text-white text-center mb-6">Comparison Results</h2>

            <ComparisonRow label="Score" icon={FiStar} leftValue={animeA.score} rightValue={animeB.score} format="score" />
            <ComparisonRow label="Ranked" icon={FiBarChart2} leftValue={animeA.rank} rightValue={animeB.rank} highlight="lower" format="text" />
            <ComparisonRow label="Popularity" icon={FiBarChart2} leftValue={animeA.popularity} rightValue={animeB.popularity} highlight="lower" format="text" />
            <ComparisonRow label="Members" icon={FiUsers} leftValue={animeA.members} rightValue={animeB.members} format="number" />
            <ComparisonRow label="Favorites" icon={FiHeart} leftValue={animeA.favorites} rightValue={animeB.favorites} format="number" />
            <ComparisonRow label="Episodes" icon={FiTv} leftValue={animeA.episodes} rightValue={animeB.episodes} format="text" />

            <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-white/[0.04]">
              <div className="text-right"><Badge>{animeA.type || 'N/A'}</Badge></div>
              <div className="text-center text-xs text-white/40">Type</div>
              <div className="text-left"><Badge>{animeB.type || 'N/A'}</Badge></div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-white/[0.04]">
              <div className="text-right"><Badge>{animeA.status || 'N/A'}</Badge></div>
              <div className="text-center text-xs text-white/40">Status</div>
              <div className="text-left"><Badge>{animeB.status || 'N/A'}</Badge></div>
            </div>

            <div className="grid grid-cols-3 items-start gap-4 py-3">
              <div className="flex flex-wrap justify-end gap-1">
                {animeA.genres?.map((g) => <Badge key={g.mal_id} variant="primary">{g.name}</Badge>)}
              </div>
              <div className="text-center text-xs text-white/40 pt-1">Genres</div>
              <div className="flex flex-wrap gap-1">
                {animeB.genres?.map((g) => <Badge key={g.mal_id} variant="accent">{g.name}</Badge>)}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Link to={`/anime/${animeA.mal_id}`} className="btn-glass text-sm flex items-center gap-1">
                View {(animeA.title_english || animeA.title).slice(0, 15)}... <FiArrowRight className="w-3 h-3" />
              </Link>
              <Link to={`/anime/${animeB.mal_id}`} className="btn-glass text-sm flex items-center gap-1">
                View {(animeB.title_english || animeB.title).slice(0, 15)}... <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
