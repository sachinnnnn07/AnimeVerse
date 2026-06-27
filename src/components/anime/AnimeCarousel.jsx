import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AnimeCard from './AnimeCard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AnimeCarousel({ anime, loading }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [anime, checkScroll]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-1 py-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {loading
          ? Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="shrink-0 w-40 sm:w-45" style={{ scrollSnapAlign: 'start' }}>
                <div className="rounded-2xl overflow-hidden border border-white/6" style={{ backgroundColor: 'var(--dark-card-bg)' }}>
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          : anime?.map((item, index) => (
              <div
                key={item.mal_id}
                className="shrink-0 w-40 sm:w-45"
                style={{ scrollSnapAlign: 'start' }}
              >
                <AnimeCard anime={item} index={index} />
              </div>
            ))}
      </div>

      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/80 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:glow-purple"
        >
          <FiChevronLeft className="w-5 h-5" />
        </motion.button>
      )}

      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/80 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:glow-purple"
        >
          <FiChevronRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
