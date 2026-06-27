import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiUser } from 'react-icons/fi';
import { cachedGet } from '@/services/api/jikanClient';
import { useDebounce } from '@/hooks/useDebounce';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils/formatters';

export default function VoiceActorPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [topVAs, setTopVAs] = useState([]);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    cachedGet('/people', { limit: 12, order_by: 'favorites', sort: 'desc' })
      .then((data) => setTopVAs(data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return; }
    setLoading(true);
    cachedGet('/people', { q: debouncedQuery, limit: 10 })
      .then((data) => setResults(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const selectVA = (va) => {
    setSelected(va);
    setDetailLoading(true);
    setQuery('');
    setResults([]);
    cachedGet(`/people/${va.mal_id}/full`)
      .then((data) => setSelectedDetail(data.data))
      .catch(console.error)
      .finally(() => setDetailLoading(false));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Voice Actor Explorer
        </h1>
        <p className="text-white/40">Discover the voices behind your favorite characters</p>
      </motion.div>

      <div className="relative max-w-md mx-auto mb-10">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search voice actors..."
          className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
        />
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-20 shadow-xl">
            {results.map((va) => (
              <button
                key={va.mal_id}
                onClick={() => selectVA(va)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
              >
                <img src={va.images?.jpg?.image_url} alt="" className="w-8 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white/80 block truncate">{va.name}</span>
                  {va.favorites > 0 && <span className="text-[10px] text-white/30">{formatNumber(va.favorites)} favorites</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedDetail ? (
          <motion.div
            key={selectedDetail.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-xl rounded-3xl" />
                  <img src={selectedDetail.images?.jpg?.image_url} alt={selectedDetail.name} className="relative w-44 rounded-2xl border border-white/10" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display font-bold text-white mb-1">{selectedDetail.name}</h2>
                {selectedDetail.given_name && <p className="text-sm text-white/40 mb-3">{selectedDetail.given_name} {selectedDetail.family_name}</p>}
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="accent"><FiHeart className="w-3 h-3" /> {formatNumber(selectedDetail.favorites)}</Badge>
                  {selectedDetail.birthday && <Badge>{new Date(selectedDetail.birthday).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Badge>}
                </div>
                {selectedDetail.about && (
                  <p className="text-sm text-white/50 line-clamp-3">{selectedDetail.about}</p>
                )}
              </div>
            </div>

            {selectedDetail.voices?.length > 0 && (
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-4">
                  Anime Roles ({selectedDetail.voices.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedDetail.voices.slice(0, 18).map((role, i) => (
                    <motion.div
                      key={`${role.anime.mal_id}-${role.character.mal_id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={`/anime/${role.anime.mal_id}`}
                        className="flex items-center gap-3 glass rounded-xl p-3 glass-hover"
                      >
                        <img src={role.character.images?.webp?.image_url || role.character.images?.jpg?.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{role.character.name}</p>
                          <p className="text-[10px] text-white/30 truncate">{role.anime.title}</p>
                        </div>
                        <Badge variant={role.role === 'Main' ? 'accent' : 'default'}>{role.role}</Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => { setSelected(null); setSelectedDetail(null); }} className="btn-glass mt-8 text-sm mx-auto block">
              ← Back to all voice actors
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-display font-bold text-white mb-4">Most Popular Voice Actors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topVAs.map((va, i) => (
                <motion.button
                  key={va.mal_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => selectVA(va)}
                  className="glass rounded-2xl p-3 text-center glass-hover"
                >
                  <img src={va.images?.jpg?.image_url} alt={va.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border border-white/10" />
                  <p className="text-xs font-medium text-white truncate">{va.name}</p>
                  <p className="text-[10px] text-white/30">{formatNumber(va.favorites)} fav</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
