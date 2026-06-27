import { cn } from '@/utils/cn';
import { getScoreBg } from '@/utils/formatters';
import { FiStar } from 'react-icons/fi';

export default function ScoreBadge({ score, size = 'sm', className }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-bold',
  };

  if (!score) {
    return (
      <span className={cn('inline-flex items-center gap-1 rounded-lg bg-gray-800/80 text-gray-400', sizes[size], className)}>
        <FiStar className="w-3 h-3" /> N/A
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg font-semibold text-white bg-gradient-to-r',
        getScoreBg(score),
        sizes[size],
        className
      )}
    >
      <FiStar className="w-3 h-3" />
      {score.toFixed(1)}
    </span>
  );
}
