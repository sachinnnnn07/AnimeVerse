import { cn } from '@/utils/cn';

export default function LoadingSpinner({ size = 'md', className, fullScreen }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <div className={cn('relative', sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-r-accent-500 animate-spin" />
      <div
        className="absolute inset-1 rounded-full border-2 border-transparent border-b-neon-blue animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-white/60 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
