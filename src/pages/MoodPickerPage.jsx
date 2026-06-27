import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { animeService } from '@/services/api/animeService';

const MOODS = [
  { emoji: '🔥', label: 'Hyped', desc: 'I want action & adrenaline', genres: '1', color: 'from-red-500 to-orange-500' },
  { emoji: '😂', label: 'Happy', desc: 'Make me laugh', genres: '4', color: 'from-yellow-400 to-amber-500' },
  { emoji: '😢', label: 'Emotional', desc: 'I want to feel deeply', genres: '8', color: 'from-blue-400 to-indigo-500' },
  { emoji: '💕', label: 'Romantic', desc: 'Love is in the air', genres: '22', color: 'from-pink-400 to-rose-500' },
  { emoji: '😱', label: 'Thrilled', desc: 'Scare & surprise me', genres: '14', color: 'from-purple-600 to-violet-700' },
  { emoji: '🤔', label: 'Thoughtful', desc: 'Make me think', genres: '7', color: 'from-teal-500 to-cyan-500' },
  { emoji: '⚔️', label: 'Adventurous', desc: 'Take me on a journey', genres: '2', color: 'from-emerald-500 to-green-600' },
  { emoji: '🔮', label: 'Mystical', desc: 'Show me another world', genres: '10', color: 'from-indigo-500 to-purple-600' },
  { emoji: '🧘', label: 'Chill', desc: 'Something relaxing', genres: '36', color: 'from-sky-400 to-blue-400' },
  { emoji: '💀', label: 'Dark', desc: 'The darker the better', genres: '58', color: 'from-gray-600 to-gray-800' },
  { emoji: '🚀', label: 'Sci-Fi', desc: 'Future & technology', genres: '24', color: 'from-cyan-500 to-blue-600' },
  { emoji: '👻', label: 'Supernatural', desc: 'Beyond the natural', genres: '37', color: 'from-violet-500 to-fuchsia-600' },
];

export default function MoodPickerPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedMood) return;
    setLoading(true);
    animeService.search({ genres: selectedMood.genres, order_by: 'score', sort: 'desc', limit: 18, min_score: 7 })
      .then((data) => setAnime(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedMood]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          What's Your Mood?
        </h1>
        <p className="text-white/40">Tell us how you feel, we'll find the perfect anime</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
        {MOODS.map((mood, i) => (
          <motion.button
            key={mood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood)}
            className={`relative p-4 md:p-5 rounded-2xl text-center transition-all overflow-hidden ${
              selectedMood?.label === mood.label
                ? 'ring-2 ring-white/30 shadow-lg'
                : 'glass glass-hover'
            }`}
          >
            {selectedMood?.label === mood.label && (
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20`} />
            )}
            <div className="relative z-10">
              <span className="text-3xl md:text-4xl block mb-2">{mood.emoji}</span>
              <span className="text-sm font-semibold text-white block">{mood.label}</span>
              <span className="text-[10px] text-white/40 block mt-0.5">{mood.desc}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{selectedMood.emoji}</span>
              <h2 className="text-xl font-display font-bold text-white">
                Best anime for when you're feeling <span className="text-gradient">{selectedMood.label}</span>
              </h2>
            </div>
            <AnimeGrid anime={anime} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
