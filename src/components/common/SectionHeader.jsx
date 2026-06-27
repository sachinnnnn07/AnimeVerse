import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function SectionHeader({ title, subtitle, link, linkText = 'View All' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-6 md:mb-8"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-white/40">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          to={link}
          className="group flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          {linkText}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}
