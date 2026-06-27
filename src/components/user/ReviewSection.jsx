import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiTrash2, FiStar, FiChevronDown } from 'react-icons/fi';
import useReviewStore from '@/store/useReviewStore';
import StarRating from './StarRating';
import useToastStore from '@/store/useToastStore';
import { formatDate } from '@/utils/formatters';

export default function ReviewSection({ animeId, animeName }) {
  const { reviews, addReview, deleteReview, getByAnime } = useReviewStore();
  const addToast = useToastStore((s) => s.addToast);
  const animeReviews = getByAnime(animeId);
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!score) { addToast({ type: 'warning', message: 'Please select a rating' }); return; }
    if (!content.trim()) { addToast({ type: 'warning', message: 'Please write a review' }); return; }

    addReview({
      animeId,
      animeName,
      score,
      title: title.trim() || 'My Review',
      content: content.trim(),
      userName: 'You',
    });

    setScore(0);
    setTitle('');
    setContent('');
    setShowForm(false);
    addToast({ type: 'success', message: 'Review submitted!' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold text-white">
          User Reviews ({animeReviews.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-glass flex items-center gap-2 text-sm"
        >
          <FiEdit3 className="w-4 h-4" />
          Write Review
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <div>
              <label className="text-sm text-white/50 mb-2 block">Your Rating</label>
              <StarRating value={score} onChange={setScore} />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1.5 block">Title (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your thoughts..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-primary-500/40 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1.5 block">Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you think of this anime?"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-primary-500/40 transition-all resize-none"
              />
              <p className="text-xs text-white/20 mt-1">{content.length} characters</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm relative z-10">
                <span className="relative z-10">Submit Review</span>
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-glass text-sm">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {animeReviews.length === 0 && !showForm && (
        <div className="glass rounded-2xl p-8 text-center">
          <span className="text-3xl block mb-3">✍️</span>
          <p className="text-white/40 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      )}

      {animeReviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                  {review.userName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{review.userName}</p>
                  <p className="text-[10px] text-white/30">{formatDate(review.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold">
                <FiStar className="w-3 h-3 fill-current" /> {review.score}/10
              </div>
              <button onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all">
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">{review.title}</h4>
          <p className="text-sm text-white/50 leading-relaxed">{review.content}</p>
        </motion.div>
      ))}
    </div>
  );
}
