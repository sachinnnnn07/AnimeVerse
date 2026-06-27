import { useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function InfiniteScroll({ onLoadMore, hasMore, loading, children }) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading]);

  return (
    <>
      {children}
      <div ref={ref} className="flex items-center justify-center py-8">
        {loading && <LoadingSpinner />}
        {!hasMore && !loading && (
          <p className="text-white/30 text-sm">You've reached the end</p>
        )}
      </div>
    </>
  );
}
