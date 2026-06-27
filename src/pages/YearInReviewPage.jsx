import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiShare2, FiDownload, FiTv, FiStar, FiClock, FiHeart, FiAward } from 'react-icons/fi';
import useWatchlistStore from '@/store/useWatchlistStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatNumber } from '@/utils/formatters';

const RANK_TITLES = [
  { min: 0, title: 'Newcomer', emoji: '🌱' },
  { min: 5, title: 'Casual Viewer', emoji: '📺' },
  { min: 15, title: 'Anime Fan', emoji: '⭐' },
  { min: 30, title: 'Otaku', emoji: '🔥' },
  { min: 50, title: 'Weeb Supreme', emoji: '👑' },
  { min: 100, title: 'Anime God', emoji: '🏆' },
];

function getAnimeRank(count) {
  return [...RANK_TITLES].reverse().find((r) => count >= r.min) || RANK_TITLES[0];
}

export default function YearInReviewPage() {
  const { items } = useWatchlistStore();
  const [tierList] = useLocalStorage('animeverse-tierlist', { S: [], A: [], B: [], C: [], D: [] });
  const [lists] = useLocalStorage('animeverse-lists', []);
  const [votes] = useLocalStorage('animeverse-votes', {});
  const cardRef = useRef(null);

  const totalAnime = items.length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const watching = items.filter((i) => i.status === 'watching').length;
  const totalEpisodes = items.reduce((sum, i) => sum + (i.episodesWatched || 0), 0);
  const hoursWatched = Math.round((totalEpisodes * 24) / 60);
  const avgScore = items.filter((i) => i.userScore).length > 0
    ? (items.filter((i) => i.userScore).reduce((sum, i) => sum + i.userScore, 0) / items.filter((i) => i.userScore).length).toFixed(1)
    : 'N/A';
  const tierCount = Object.values(tierList).flat().length;
  const listCount = lists.length;
  const voteCount = Object.values(votes).reduce((sum, v) => sum + v, 0);
  const rank = getAnimeRank(totalAnime);
  const year = new Date().getFullYear();

  const stats = [
    { icon: FiTv, label: 'Anime Tracked', value: totalAnime, color: 'text-primary-400' },
    { icon: FiStar, label: 'Completed', value: completed, color: 'text-green-400' },
    { icon: FiClock, label: 'Hours Watched', value: hoursWatched, color: 'text-neon-blue' },
    { icon: FiHeart, label: 'Votes Cast', value: voteCount, color: 'text-accent-400' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Your {year} in Anime</h1>
        <p className="text-white/40">Your personal anime journey — Wrapped</p>
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500 rounded-full blur-[80px]" />
        </div>

        <div className="relative p-8 md:p-10">
          <div className="text-center mb-8">
            <span className="text-5xl mb-3 block">{rank.emoji}</span>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{rank.title}</h2>
            <p className="text-sm text-white/40">Your anime rank for {year}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass rounded-xl p-4 text-center"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
                <div className="text-xl font-bold text-white font-display">{stat.value}</div>
                <div className="text-[10px] text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
              <span className="text-sm text-white/60">Currently Watching</span>
              <span className="text-sm font-bold text-white">{watching}</span>
            </div>
            <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
              <span className="text-sm text-white/60">Average Score</span>
              <span className="text-sm font-bold text-white">{avgScore}</span>
            </div>
            <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
              <span className="text-sm text-white/60">Tier List Rankings</span>
              <span className="text-sm font-bold text-white">{tierCount}</span>
            </div>
            <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
              <span className="text-sm text-white/60">Custom Lists Created</span>
              <span className="text-sm font-bold text-white">{listCount}</span>
            </div>
          </div>

          <div className="text-center border-t border-white/[0.06] pt-6">
            <p className="text-xs text-white/20">AnimeVerse • {year} Year in Review</p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `My ${year} Anime Wrapped`, text: `I tracked ${totalAnime} anime and watched ${hoursWatched} hours! My rank: ${rank.title} ${rank.emoji}`, url: window.location.href });
            }
          }}
          className="btn-glass flex items-center gap-2 text-sm"
        >
          <FiShare2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
