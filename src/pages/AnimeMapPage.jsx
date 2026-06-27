import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiExternalLink } from 'react-icons/fi';
import Badge from '@/components/ui/Badge';

const ANIME_LOCATIONS = [
  { region: 'Tokyo, Japan', flag: '🗼', color: 'from-red-500 to-rose-600', anime: [
    { id: 22319, title: 'Tokyo Ghoul' },
    { id: 31964, title: 'Boku no Hero Academia' },
    { id: 20, title: 'Naruto' },
    { id: 30276, title: 'One Punch Man' },
    { id: 40748, title: 'Jujutsu Kaisen' },
    { id: 20507, title: 'Noragami' },
  ]},
  { region: 'Kyoto, Japan', flag: '⛩️', color: 'from-pink-500 to-fuchsia-600', anime: [
    { id: 23273, title: 'Shigatsu wa Kimi no Uso' },
    { id: 34599, title: 'Made in Abyss' },
    { id: 33352, title: 'Violet Evergarden' },
  ]},
  { region: 'Italy', flag: '🇮🇹', color: 'from-green-500 to-emerald-600', anime: [
    { id: 14719, title: "JoJo's Bizarre Adventure" },
    { id: 37991, title: 'JoJo Part 5: Golden Wind' },
    { id: 820, title: 'Gunslinger Girl' },
  ]},
  { region: 'Germany', flag: '🇩🇪', color: 'from-yellow-500 to-amber-600', anime: [
    { id: 16498, title: 'Attack on Titan' },
    { id: 30, title: 'Neon Genesis Evangelion' },
    { id: 5114, title: 'Fullmetal Alchemist: Brotherhood' },
    { id: 31240, title: 'Re:Zero' },
  ]},
  { region: 'England / UK', flag: '🇬🇧', color: 'from-blue-500 to-indigo-600', anime: [
    { id: 1735, title: 'Black Butler' },
    { id: 9253, title: 'Steins;Gate' },
    { id: 889, title: 'Black Cat' },
  ]},
  { region: 'China', flag: '🇨🇳', color: 'from-red-600 to-red-700', anime: [
    { id: 28851, title: 'Arslan Senki' },
    { id: 31043, title: 'Bungou Stray Dogs' },
  ]},
  { region: 'Egypt', flag: '🇪🇬', color: 'from-amber-500 to-orange-600', anime: [
    { id: 26055, title: "JoJo Part 3: Egypt Arc" },
    { id: 1, title: 'Yu☆Gi☆Oh!' },
  ]},
  { region: 'Space / Sci-Fi', flag: '🚀', color: 'from-purple-500 to-violet-600', anime: [
    { id: 5, title: 'Cowboy Bebop' },
    { id: 820, title: 'Legend of the Galactic Heroes' },
    { id: 1, title: 'Mobile Suit Gundam' },
    { id: 6547, title: 'Angel Beats!' },
    { id: 9253, title: 'Steins;Gate' },
  ]},
  { region: 'Fantasy World', flag: '🏰', color: 'from-indigo-500 to-purple-600', anime: [
    { id: 11061, title: 'Sword Art Online' },
    { id: 21355, title: 'Re:Zero' },
    { id: 28977, title: 'KonoSuba' },
    { id: 30831, title: 'Kono Subarashii Sekai' },
    { id: 49387, title: 'Mushoku Tensei' },
    { id: 40434, title: 'Ousama Ranking' },
  ]},
  { region: 'USA', flag: '🇺🇸', color: 'from-blue-600 to-red-500', anime: [
    { id: 1735, title: 'Baccano!' },
    { id: 47, title: 'Trigun' },
    { id: 5, title: 'Cowboy Bebop' },
    { id: 31964, title: 'Boku no Hero Academia' },
  ]},
];

export default function AnimeMapPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Anime World Map</h1>
        <p className="text-white/40">Explore anime set in real-world locations</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
        {ANIME_LOCATIONS.map((loc, i) => (
          <motion.button
            key={loc.region}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(selected?.region === loc.region ? null : loc)}
            className={`relative p-4 rounded-2xl text-center transition-all overflow-hidden ${
              selected?.region === loc.region ? 'ring-2 ring-white/30' : 'glass glass-hover'
            }`}
          >
            {selected?.region === loc.region && (
              <div className={`absolute inset-0 bg-gradient-to-br ${loc.color} opacity-15`} />
            )}
            <div className="relative z-10">
              <span className="text-2xl block mb-1.5">{loc.flag}</span>
              <span className="text-[11px] font-semibold text-white block leading-tight">{loc.region}</span>
              <span className="text-[9px] text-white/30 mt-0.5 block">{loc.anime.length} anime</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.region}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{selected.flag}</span>
              <div>
                <h2 className="text-lg font-display font-bold text-white">{selected.region}</h2>
                <p className="text-xs text-white/40">{selected.anime.length} anime set in this location</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selected.anime.map((anime, i) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/anime/${anime.id}`}
                    className="flex items-center gap-3 glass rounded-xl p-3 glass-hover"
                  >
                    <FiMapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span className="text-sm text-white/80 flex-1 truncate">{anime.title}</span>
                    <FiExternalLink className="w-3.5 h-3.5 text-white/20" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
