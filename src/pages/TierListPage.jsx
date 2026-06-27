import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiDownload, FiTrash2 } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const TIERS = [
  { key: 'S', label: 'S', color: 'from-red-500 to-rose-600', bg: 'bg-red-500/10 border-red-500/30' },
  { key: 'A', label: 'A', color: 'from-orange-500 to-amber-600', bg: 'bg-orange-500/10 border-orange-500/30' },
  { key: 'B', label: 'B', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { key: 'C', label: 'C', color: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10 border-green-500/30' },
  { key: 'D', label: 'D', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10 border-blue-500/30' },
];

function AnimeChip({ anime, onRemove }) {
  const img = anime.image || anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group flex-shrink-0"
    >
      <img
        src={img}
        alt={anime.title}
        title={anime.title}
        className="w-14 h-20 md:w-16 md:h-22 rounded-lg object-cover border border-white/10"
      />
      {onRemove && (
        <button
          onClick={() => onRemove(anime.mal_id)}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiX className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}

export default function TierListPage() {
  const [tierList, setTierList] = useLocalStorage('animeverse-tierlist', { S: [], A: [], B: [], C: [], D: [] });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return; }
    setSearching(true);
    animeService.search({ q: debouncedQuery, limit: 8, order_by: 'popularity', sort: 'asc' })
      .then((data) => setResults(data.data || []))
      .catch(() => {})
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  const addToTier = (tier, anime) => {
    const isAlreadyPlaced = Object.values(tierList).flat().some((a) => a.mal_id === anime.mal_id);
    if (isAlreadyPlaced) return;
    const entry = {
      mal_id: anime.mal_id,
      title: anime.title_english || anime.title,
      image: anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url,
    };
    setTierList((prev) => ({ ...prev, [tier]: [...prev[tier], entry] }));
    setQuery('');
    setResults([]);
  };

  const removeFromTier = (tier, malId) => {
    setTierList((prev) => ({ ...prev, [tier]: prev[tier].filter((a) => a.mal_id !== malId) }));
  };

  const clearAll = () => setTierList({ S: [], A: [], B: [], C: [], D: [] });

  const totalAnime = Object.values(tierList).flat().length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Anime Tier List
        </h1>
        <p className="text-white/40">Rank your anime from S-tier to D-tier</p>
      </motion.div>

      <div className="relative mb-8 max-w-md mx-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime to add..."
          className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
        />
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-20 shadow-xl max-h-60 overflow-y-auto">
            {results.map((anime) => {
              const placed = Object.values(tierList).flat().some((a) => a.mal_id === anime.mal_id);
              return (
                <div key={anime.mal_id} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
                  <img src={anime.images?.webp?.small_image_url} alt="" className="w-8 h-11 rounded object-cover" />
                  <span className="text-sm text-white/80 truncate flex-1">{anime.title_english || anime.title}</span>
                  {placed ? (
                    <span className="text-[10px] text-white/30">Added</span>
                  ) : (
                    <div className="flex gap-1">
                      {TIERS.map((t) => (
                        <button
                          key={t.key}
                          onClick={() => addToTier(t.key, anime)}
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color} text-white text-[10px] font-bold hover:scale-110 transition-transform`}
                        >
                          {t.key}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-8">
        {TIERS.map((tier) => (
          <div key={tier.key} className={`flex gap-3 rounded-2xl border p-3 min-h-[80px] ${tier.bg}`}>
            <div className={`w-14 md:w-16 flex-shrink-0 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
              <span className="text-2xl font-black text-white font-display">{tier.label}</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center flex-1">
              {tierList[tier.key].length === 0 ? (
                <span className="text-xs text-white/20 italic">Drop anime here</span>
              ) : (
                tierList[tier.key].map((anime) => (
                  <AnimeChip key={anime.mal_id} anime={anime} onRemove={(id) => removeFromTier(tier.key, id)} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white/30">{totalAnime} anime ranked</span>
        {totalAnime > 0 && (
          <button onClick={clearAll} className="flex items-center gap-2 text-sm text-red-400/60 hover:text-red-400 transition-colors">
            <FiTrash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>
    </div>
  );
}
