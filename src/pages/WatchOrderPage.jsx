import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiExternalLink, FiList } from 'react-icons/fi';

const WATCH_ORDERS = [
  {
    id: 'fate',
    name: 'Fate Series',
    emoji: '⚔️',
    desc: 'The Holy Grail War saga',
    orders: [
      { title: 'Fate/Zero', id: 10087, note: 'Prequel — great starting point' },
      { title: 'Fate/Stay Night: Unlimited Blade Works', id: 22297, note: 'Main route' },
      { title: "Fate/Stay Night: Heaven's Feel I", id: 25537, note: 'Movie trilogy' },
      { title: "Fate/Stay Night: Heaven's Feel II", id: 33049, note: 'Movie trilogy' },
      { title: "Fate/Stay Night: Heaven's Feel III", id: 33050, note: 'Movie trilogy' },
      { title: 'Fate/Grand Order: Babylonia', id: 38084, note: 'Standalone spinoff' },
    ],
  },
  {
    id: 'monogatari',
    name: 'Monogatari Series',
    emoji: '🦇',
    desc: 'Novel order (recommended)',
    orders: [
      { title: 'Bakemonogatari', id: 5081, note: 'Start here' },
      { title: 'Kizumonogatari I-III', id: 9260, note: 'Movie prequel trilogy' },
      { title: 'Nisemonogatari', id: 11597, note: '' },
      { title: 'Nekomonogatari: Kuro', id: 15689, note: '' },
      { title: 'Monogatari Series: Second Season', id: 17074, note: 'Peak of the series' },
      { title: 'Owarimonogatari', id: 31181, note: '' },
      { title: 'Zoku Owarimonogatari', id: 36999, note: 'Finale' },
    ],
  },
  {
    id: 'toaru',
    name: 'A Certain Magical Index',
    emoji: '⚡',
    desc: 'Academy City universe',
    orders: [
      { title: 'A Certain Magical Index', id: 4654, note: 'Start here' },
      { title: 'A Certain Scientific Railgun', id: 6213, note: 'Spinoff' },
      { title: 'A Certain Magical Index II', id: 8937, note: '' },
      { title: 'A Certain Scientific Railgun S', id: 16049, note: '' },
      { title: 'A Certain Magical Index III', id: 36432, note: '' },
      { title: 'A Certain Scientific Accelerator', id: 38480, note: 'Spinoff' },
      { title: 'A Certain Scientific Railgun T', id: 38481, note: '' },
    ],
  },
  {
    id: 'jojo',
    name: "JoJo's Bizarre Adventure",
    emoji: '💪',
    desc: 'Follow the Joestar bloodline',
    orders: [
      { title: 'Phantom Blood + Battle Tendency (2012)', id: 14719, note: 'Parts 1-2' },
      { title: 'Stardust Crusaders', id: 20899, note: 'Part 3' },
      { title: 'Stardust Crusaders S2: Egypt Arc', id: 26055, note: 'Part 3 continued' },
      { title: 'Diamond is Unbreakable', id: 31933, note: 'Part 4' },
      { title: 'Golden Wind', id: 37991, note: 'Part 5' },
      { title: 'Stone Ocean', id: 48661, note: 'Part 6' },
    ],
  },
  {
    id: 'gundam',
    name: 'Gundam (UC Timeline)',
    emoji: '🤖',
    desc: 'Universal Century timeline',
    orders: [
      { title: 'Mobile Suit Gundam', id: 80, note: 'The original (1979)' },
      { title: 'Mobile Suit Zeta Gundam', id: 85, note: 'Direct sequel' },
      { title: 'Mobile Suit Gundam ZZ', id: 86, note: '' },
      { title: "Mobile Suit Gundam: Char's Counterattack", id: 87, note: 'Movie' },
      { title: 'Mobile Suit Gundam Unicorn', id: 6336, note: 'OVA series' },
      { title: 'Gundam: The Witch from Mercury', id: 49828, note: 'Standalone — great entry point' },
    ],
  },
  {
    id: 'dragonball',
    name: 'Dragon Ball',
    emoji: '🐉',
    desc: 'The legendary shonen franchise',
    orders: [
      { title: 'Dragon Ball', id: 223, note: 'Start here — young Goku' },
      { title: 'Dragon Ball Z', id: 813, note: 'Main saga' },
      { title: 'Dragon Ball Z: Battle of Gods', id: 14837, note: 'Movie' },
      { title: 'Dragon Ball Super', id: 30694, note: 'Sequel series' },
      { title: 'Dragon Ball Super: Broly', id: 36946, note: 'Movie' },
      { title: 'Dragon Ball Super: Super Hero', id: 50608, note: 'Movie' },
    ],
  },
];

export default function WatchOrderPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Watch Order Guide
        </h1>
        <p className="text-white/40">Never watch anime in the wrong order again</p>
      </motion.div>

      <div className="space-y-3">
        {WATCH_ORDERS.map((series, i) => (
          <motion.div
            key={series.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setExpanded(expanded === series.id ? null : series.id)}
              className="w-full flex items-center gap-4 glass rounded-2xl p-4 md:p-5 glass-hover text-left"
            >
              <span className="text-3xl">{series.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white">{series.name}</h3>
                <p className="text-xs text-white/40">{series.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-white/30">{series.orders.length} entries</span>
                <FiChevronDown className={`w-4 h-4 text-white/40 transition-transform ${expanded === series.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {expanded === series.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 md:ml-8 mt-2 space-y-0 border-l-2 border-primary-500/20 pl-6">
                    {series.orders.map((entry, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative py-3"
                      >
                        <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-primary-500 border-2 border-dark" style={{ borderColor: 'var(--page-bg)' }} />
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center text-[10px] font-bold text-primary-400 flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/anime/${entry.id}`}
                              className="text-sm font-medium text-white hover:text-primary-400 transition-colors"
                            >
                              {entry.title}
                            </Link>
                            {entry.note && <p className="text-[10px] text-white/30 mt-0.5">{entry.note}</p>}
                          </div>
                          <Link to={`/anime/${entry.id}`} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0">
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
