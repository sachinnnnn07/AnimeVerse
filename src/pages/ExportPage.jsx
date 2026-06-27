import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFile, FiFileText, FiCopy, FiCheck } from 'react-icons/fi';
import useWatchlistStore from '@/store/useWatchlistStore';
import useAuthStore from '@/store/useAuthStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ExportPage() {
  const { user } = useAuthStore();
  const { items } = useWatchlistStore();
  const [lists] = useLocalStorage('animeverse-lists', []);
  const [tierList] = useLocalStorage('animeverse-tierlist', { S: [], A: [], B: [], C: [], D: [] });
  const [copied, setCopied] = useState(false);

  const watchlistData = items.length > 0 ? items : [];
  const allData = { watchlist: watchlistData, customLists: lists, tierList };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animeverse-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ['Title', 'Type', 'Status', 'Score', 'Episodes'];
    const rows = watchlistData.map((item) =>
      [item.title, item.type, item.status, item.score || '', item.episodes || ''].map((v) => `"${v}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animeverse-watchlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalAnime = watchlistData.length + lists.reduce((sum, l) => sum + l.anime.length, 0);
  const totalTier = Object.values(tierList).flat().length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Export Data</h1>
        <p className="text-white/40">Download or copy your anime data</p>
      </motion.div>

      <div className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">What's included</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white font-display">{watchlistData.length}</div>
            <div className="text-[10px] text-white/40">Watchlist</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white font-display">{lists.length}</div>
            <div className="text-[10px] text-white/40">Custom Lists</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-2xl font-bold text-white font-display">{totalTier}</div>
            <div className="text-[10px] text-white/40">Tier List</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          onClick={downloadJSON}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center gap-4 glass rounded-2xl p-5 glass-hover text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
            <FiFile className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Export as JSON</h3>
            <p className="text-xs text-white/40">Full export with all data — watchlist, lists, tier list</p>
          </div>
          <FiDownload className="w-5 h-5 text-white/30" />
        </motion.button>

        <motion.button
          onClick={downloadCSV}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center gap-4 glass rounded-2xl p-5 glass-hover text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
            <FiFileText className="w-5 h-5 text-accent-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Export as CSV</h3>
            <p className="text-xs text-white/40">Watchlist only — compatible with spreadsheets</p>
          </div>
          <FiDownload className="w-5 h-5 text-white/30" />
        </motion.button>

        <motion.button
          onClick={copyJSON}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center gap-4 glass rounded-2xl p-5 glass-hover text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
            {copied ? <FiCheck className="w-5 h-5 text-green-400" /> : <FiCopy className="w-5 h-5 text-neon-blue" />}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{copied ? 'Copied!' : 'Copy to Clipboard'}</h3>
            <p className="text-xs text-white/40">Copy JSON data to clipboard</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
