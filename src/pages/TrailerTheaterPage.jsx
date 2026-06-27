import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiSkipForward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { topService } from '@/services/api/topService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TrailerTheaterPage() {
  const [animeList, setAnimeList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    topService.getTopAnime({ filter: 'airing', limit: 25 })
      .then((data) => {
        const withTrailers = (data.data || []).filter((a) => a.trailer?.youtube_id);
        setAnimeList(withTrailers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = animeList[currentIndex];
  const next = () => setCurrentIndex((i) => (i + 1) % animeList.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + animeList.length) % animeList.length);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="w-full aspect-video rounded-2xl mb-6" />
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <span className="text-5xl block mb-4">🎬</span>
          <h2 className="text-xl font-bold text-white">No trailers available</h2>
        </div>
      </div>
    );
  }

  const title = current.title_english || current.title;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Trailer Theater
        </h1>
        <p className="text-white/40">Watch trailers from trending anime — cinema style</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.mal_id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative rounded-2xl overflow-hidden glass-strong mb-6">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${current.trailer.youtube_id}?autoplay=0&rel=0`}
                title={title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <Link to={`/anime/${current.mal_id}`} className="group">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-gradient transition-all truncate">
                  {title}
                </h2>
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <ScoreBadge score={current.score} size="md" />
                {current.type && <Badge variant="primary">{current.type}</Badge>}
                {current.episodes && <Badge>{current.episodes} eps</Badge>}
                {current.genres?.slice(0, 3).map((g) => (
                  <Badge key={g.mal_id}>{g.name}</Badge>
                ))}
              </div>
              {current.synopsis && (
                <p className="text-sm text-white/40 mt-3 line-clamp-2">{current.synopsis}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={prev} className="p-2.5 rounded-xl glass text-white/60 hover:text-white transition-all">
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-white/30 min-w-[40px] text-center">
                {currentIndex + 1}/{animeList.length}
              </span>
              <button onClick={next} className="p-2.5 rounded-xl glass text-white/60 hover:text-white transition-all">
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Up Next</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {animeList.map((anime, i) => {
            const img = anime.images?.webp?.image_url || anime.images?.jpg?.image_url;
            return (
              <button
                key={anime.mal_id}
                onClick={() => setCurrentIndex(i)}
                className={`flex-shrink-0 w-32 rounded-xl overflow-hidden transition-all ${
                  i === currentIndex ? 'ring-2 ring-primary-500 opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full aspect-video object-cover" />
                <div className="p-1.5">
                  <p className="text-[10px] text-white/70 truncate">{anime.title_english || anime.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
