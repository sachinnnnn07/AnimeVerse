import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function GlassCard({ children, className, hover = true, glow, ...props }) {
  return (
    <motion.div
      className={cn(
        'glass-card p-4',
        hover && 'cursor-pointer',
        glow === 'purple' && 'hover:glow-purple',
        glow === 'pink' && 'hover:glow-pink',
        glow === 'neon' && 'hover:glow-neon',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.015 } : undefined}
      whileTap={hover ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
