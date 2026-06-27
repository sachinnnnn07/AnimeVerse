import { cn } from '@/utils/cn';

const variants = {
  default: 'bg-white/10 text-white/80 border-white/10',
  primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  accent: 'bg-accent-500/20 text-accent-300 border-accent-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  neon: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
