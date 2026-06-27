import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import useWatchlistStore from '@/store/useWatchlistStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useRecentStore from '@/store/useRecentStore';

const ACHIEVEMENTS = [
  { id: 'first_add', emoji: '🌟', title: 'First Step', desc: 'Add your first anime to watchlist', check: (d) => d.watchlist >= 1 },
  { id: 'five_anime', emoji: '📚', title: 'Getting Started', desc: 'Track 5 anime in your watchlist', check: (d) => d.watchlist >= 5 },
  { id: 'ten_anime', emoji: '🔥', title: 'On Fire', desc: 'Track 10 anime', check: (d) => d.watchlist >= 10 },
  { id: 'twentyfive_anime', emoji: '⚡', title: 'Powerhouse', desc: 'Track 25 anime', check: (d) => d.watchlist >= 25 },
  { id: 'fifty_anime', emoji: '👑', title: 'Anime Royalty', desc: 'Track 50 anime', check: (d) => d.watchlist >= 50 },
  { id: 'hundred_anime', emoji: '🏆', title: 'Legendary', desc: 'Track 100 anime', check: (d) => d.watchlist >= 100 },
  { id: 'first_complete', emoji: '✅', title: 'Mission Complete', desc: 'Mark an anime as completed', check: (d) => d.completed >= 1 },
  { id: 'ten_complete', emoji: '🎖️', title: 'Binge Master', desc: 'Complete 10 anime', check: (d) => d.completed >= 10 },
  { id: 'first_list', emoji: '📝', title: 'List Maker', desc: 'Create your first custom list', check: (d) => d.lists >= 1 },
  { id: 'five_lists', emoji: '📋', title: 'Organized', desc: 'Create 5 custom lists', check: (d) => d.lists >= 5 },
  { id: 'tier_starter', emoji: '📊', title: 'Tier Judge', desc: 'Add anime to your tier list', check: (d) => d.tierCount >= 1 },
  { id: 'tier_master', emoji: '🏅', title: 'Tier Master', desc: 'Rank 20 anime in tier list', check: (d) => d.tierCount >= 20 },
  { id: 'explorer', emoji: '🗺️', title: 'Explorer', desc: 'View 10 different anime pages', check: (d) => d.recentViewed >= 10 },
  { id: 'deep_diver', emoji: '🤿', title: 'Deep Diver', desc: 'View 30 anime detail pages', check: (d) => d.recentViewed >= 30 },
  { id: 'voter', emoji: '❤️', title: 'Opinion Maker', desc: 'Cast votes in This or That', check: (d) => d.votes >= 1 },
  { id: 'voter_ten', emoji: '🗳️', title: 'Democracy', desc: 'Cast 10 votes in This or That', check: (d) => d.votes >= 10 },
  { id: 'watching_five', emoji: '👀', title: 'Multitasker', desc: 'Have 5 anime as "watching"', check: (d) => d.watching >= 5 },
  { id: 'diverse', emoji: '🌈', title: 'Diverse Taste', desc: 'Track anime in 3+ custom lists', check: (d) => d.listsWithAnime >= 3 },
];

export default function AchievementsPage() {
  const { items } = useWatchlistStore();
  const [lists] = useLocalStorage('animeverse-lists', []);
  const [tierList] = useLocalStorage('animeverse-tierlist', { S: [], A: [], B: [], C: [], D: [] });
  const [votes] = useLocalStorage('animeverse-votes', {});
  const { items: recentItems } = useRecentStore();

  const data = {
    watchlist: items.length,
    completed: items.filter((i) => i.status === 'completed').length,
    watching: items.filter((i) => i.status === 'watching').length,
    lists: lists.length,
    listsWithAnime: lists.filter((l) => l.anime.length > 0).length,
    tierCount: Object.values(tierList).flat().length,
    recentViewed: recentItems.length,
    votes: Object.values(votes).reduce((sum, v) => sum + v, 0),
  };

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(data));
  const locked = ACHIEVEMENTS.filter((a) => !a.check(data));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Achievements</h1>
        <p className="text-white/40">
          {unlocked.length}/{ACHIEVEMENTS.length} unlocked — keep watching to earn more!
        </p>
      </motion.div>

      <div className="glass-strong rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">Progress</span>
          <span className="text-sm font-bold text-white">{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiAward className="w-4 h-4" /> Unlocked ({unlocked.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlocked.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 glass rounded-xl p-4 border border-green-500/10"
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{achievement.title}</h3>
                  <p className="text-[11px] text-white/40">{achievement.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/30 uppercase tracking-wider mb-4">
            Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className="flex items-center gap-3 glass rounded-xl p-4 opacity-40"
              >
                <span className="text-2xl grayscale">🔒</span>
                <div>
                  <h3 className="text-sm font-bold text-white/50">{achievement.title}</h3>
                  <p className="text-[11px] text-white/25">{achievement.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
