import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function StarRating({ value = 0, onChange, size = 'md', readonly = false }) {
  const [hover, setHover] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hover || value);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHover(starValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onChange?.(starValue)}
            className={cn(
              'transition-all',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              filled ? 'text-yellow-400' : 'text-white/15'
            )}
          >
            <FiStar className={cn(sizes[size], filled && 'fill-current')} />
          </button>
        );
      })}
    </div>
  );
}
