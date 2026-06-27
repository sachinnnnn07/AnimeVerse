import { motion } from 'framer-motion';
import AnimeCard from './AnimeCard';
import { SkeletonGrid } from '@/components/ui/Skeleton';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function AnimeGrid({ anime, loading, columns }) {
  if (loading) return <SkeletonGrid count={12} />;

  if (!anime?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-display font-bold text-white/80 mb-2">No anime found</h3>
        <p className="text-white/40">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5"
    >
      {anime.map((item, index) => (
        <AnimeCard key={item.mal_id} anime={item} index={index} />
      ))}
    </motion.div>
  );
}
