import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiFilm, FiAward } from 'react-icons/fi';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { animeService } from '@/services/api/animeService';
import { cachedGet } from '@/services/api/jikanClient';

const STUDIOS = [
  { id: 43, name: 'ufotable', logo: '⚡', desc: 'Demon Slayer, Fate series' },
  { id: 569, name: 'MAPPA', logo: '🎨', desc: 'Jujutsu Kaisen, Attack on Titan S4' },
  { id: 11, name: 'Madhouse', logo: '🏠', desc: 'One Punch Man, Death Note' },
  { id: 2, name: 'Kyoto Animation', logo: '🌸', desc: 'Violet Evergarden, K-On!' },
  { id: 1, name: 'Pierrot', logo: '🎪', desc: 'Naruto, Bleach' },
  { id: 21, name: 'Studio Ghibli', logo: '🌿', desc: 'Spirited Away, My Neighbor Totoro' },
  { id: 4, name: 'Bones', logo: '💀', desc: 'My Hero Academia, Mob Psycho 100' },
  { id: 44, name: 'Shaft', logo: '🔷', desc: 'Monogatari, Madoka Magica' },
  { id: 14, name: 'Sunrise', logo: '☀️', desc: 'Gundam, Code Geass' },
  { id: 858, name: 'Wit Studio', logo: '🗡️', desc: 'Attack on Titan S1-3, Spy x Family' },
  { id: 37, name: 'Studio Deen', logo: '📺', desc: 'Konosuba, Fate/Stay Night' },
  { id: 10, name: 'Production I.G', logo: '🎬', desc: 'Haikyuu, Psycho-Pass' },
];

export default function StudioSpotlightPage() {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStudio) return;
    setLoading(true);
    animeService.search({ producers: selectedStudio.id, order_by: 'score', sort: 'desc', limit: 18 })
      .then((data) => setAnime(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedStudio]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Studio Spotlight
        </h1>
        <p className="text-white/40">Explore anime by the studios that brought them to life</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
        {STUDIOS.map((studio, i) => (
          <motion.button
            key={studio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStudio(studio)}
            className={`p-4 rounded-2xl text-center transition-all ${
              selectedStudio?.id === studio.id
                ? 'glass-strong ring-2 ring-primary-500/30 shadow-lg shadow-primary-500/10'
                : 'glass glass-hover'
            }`}
          >
            <span className="text-2xl md:text-3xl block mb-2">{studio.logo}</span>
            <span className="text-xs md:text-sm font-bold text-white block truncate">{studio.name}</span>
            <span className="text-[10px] text-white/30 block mt-0.5 truncate">{studio.desc}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedStudio && (
          <motion.div
            key={selectedStudio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{selectedStudio.logo}</span>
              <div>
                <h2 className="text-xl font-display font-bold text-white">{selectedStudio.name}</h2>
                <p className="text-sm text-white/40">{selectedStudio.desc}</p>
              </div>
            </div>
            <AnimeGrid anime={anime} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
