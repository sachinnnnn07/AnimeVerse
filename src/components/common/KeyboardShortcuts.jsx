import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCommand, FiX } from 'react-icons/fi';

const SHORTCUTS = [
  { keys: ['/', 'Ctrl+K'], action: 'Search', description: 'Focus search bar' },
  { keys: ['Esc'], action: 'Close', description: 'Close modals & dropdowns' },
  { keys: ['?'], action: 'Help', description: 'Show keyboard shortcuts' },
  { keys: ['H'], action: 'Home', description: 'Go to home page' },
  { keys: ['B'], action: 'Browse', description: 'Go to browse page' },
  { keys: ['R'], action: 'Random', description: 'Random anime picker' },
];

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        const searchBtn = document.querySelector('[data-search-toggle]');
        searchBtn?.click();
      }

      if (e.key === 'Escape') {
        setShowHelp(false);
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowHelp((s) => !s);
      }

      if (e.key === 'h' || e.key === 'H') navigate('/');
      if (e.key === 'b' || e.key === 'B') navigate('/browse');
      if (e.key === 'r' || e.key === 'R') navigate('/random');
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <AnimatePresence>
      {showHelp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setShowHelp(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-strong rounded-3xl p-6 z-[101]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FiCommand className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-display font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.action} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-white/60">{s.description}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/20 text-center mt-4">Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">?</kbd> to toggle</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
