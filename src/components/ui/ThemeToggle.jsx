import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import useThemeStore from '@/store/useThemeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.85 }}
      className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5 text-yellow-400" />}
      </motion.div>
    </motion.button>
  );
}
