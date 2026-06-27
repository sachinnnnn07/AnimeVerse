import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiHeart, FiBarChart2 } from 'react-icons/fi';
import { topService } from '@/services/api/topService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ThisOrThatPage() {
  const [pool, setPool] = useState([]);
  const [pair, setPair] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useLocalStorage('animeverse-votes', {});
  const [round, setRound] = useState(0);

  useEffect(() => {
    topService.getTopAnime({ limit: 25 })
      .then((data) => {
        const list = data.data || [];
        setPool(list);
        pickPair(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pickPair = (list) => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setPair([shuffled[0], shuffled[1]]);
    setVoted(null);
  };

  const handleVote = (winner) => {
    setVoted(winner.mal_id);
    setVotes((prev) => ({
      ...prev,
      [winner.mal_id]: (prev[winner.mal_id] || 0) + 1,
    }));

    setTimeout(() => {
      setRound((r) => r + 1);
      pickPair(pool);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <Skeleton className="aspect-[3/4] rounded-2xl" />
        </div>
      </div>
    );
  }

  const [animeA, animeB] = pair;
  if (!animeA || !animeB) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          This or That?
        </h1>
        <p className="text-white/40">Pick your favorite — impossible choices await</p>
        <p className="text-xs text-white/20 mt-1">Round {round + 1}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${animeA.mal_id}-${animeB.mal_id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid grid-cols-2 gap-4 md:gap-6"
        >
          {[animeA, animeB].map((anime, idx) => {
            const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
            const title = anime.title_english || anime.title;
            const isWinner = voted === anime.mal_id;
            const isLoser = voted && voted !== anime.mal_id;
            const totalVotes = (votes[anime.mal_id] || 0);

            return (
              <motion.button
                key={anime.mal_id}
                onClick={() => !voted && handleVote(anime)}
                disabled={!!voted}
                whileHover={!voted ? { scale: 1.03 } : undefined}
                whileTap={!voted ? { scale: 0.97 } : undefined}
                className={`relative rounded-2xl overflow-hidden text-left transition-all ${
                  isWinner ? 'ring-4 ring-green-500/50 shadow-lg shadow-green-500/20' :
                  isLoser ? 'opacity-40 scale-95' : 'cursor-pointer'
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {isWinner && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                    >
                      <FiHeart className="w-6 h-6 text-white" />
                    </motion.div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <ScoreBadge score={anime.score} size="md" className="mb-2" />
                    <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 mb-1"
                        style={{ color: 'white', WebkitTextFillColor: 'white' }}>
                      {title}
                    </h3>
                    <p className="text-[10px] text-white/60" style={{ color: 'rgba(255,255,255,0.6)', WebkitTextFillColor: 'rgba(255,255,255,0.6)' }}>
                      {anime.genres?.slice(0, 2).map((g) => g.name).join(' · ')}
                    </p>
                    {totalVotes > 0 && (
                      <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1"
                         style={{ color: 'rgba(255,255,255,0.4)', WebkitTextFillColor: 'rgba(255,255,255,0.4)' }}>
                        <FiBarChart2 className="w-3 h-3" /> {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => pickPair(pool)}
          className="btn-glass flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className="w-4 h-4" /> Skip
        </button>
      </div>
    </div>
  );
}
