import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiCheck, FiX, FiAward, FiZap } from 'react-icons/fi';
import { topService } from '@/services/api/topService';
import ScoreBadge from '@/components/ui/ScoreBadge';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [animePool, setAnimePool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);

  const TOTAL_QUESTIONS = 10;

  const generateQuestions = useCallback((pool) => {
    const qs = [];
    const shuffled = shuffleArray(pool);

    for (let i = 0; i < Math.min(TOTAL_QUESTIONS, Math.floor(shuffled.length / 4)); i++) {
      const correct = shuffled[i * 4];
      const options = shuffleArray([
        shuffled[i * 4],
        shuffled[i * 4 + 1],
        shuffled[i * 4 + 2],
        shuffled[i * 4 + 3],
      ]);

      const image = correct.images?.webp?.large_image_url || correct.images?.jpg?.large_image_url;

      qs.push({
        image,
        correctId: correct.mal_id,
        correctTitle: correct.title_english || correct.title,
        options: options.map((a) => ({
          mal_id: a.mal_id,
          title: a.title_english || a.title,
        })),
      });
    }
    return qs;
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      topService.getTopAnime({ limit: 25, page: 1 }),
      topService.getTopAnime({ limit: 25, page: 2 }),
    ])
      .then(([d1, d2]) => {
        const pool = [...(d1.data || []), ...(d2.data || [])];
        setAnimePool(pool);
        setQuestions(generateQuestions(pool));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentQ = questions[questionIndex];

  const handleAnswer = (optionId) => {
    if (showResult) return;
    setSelected(optionId);
    setShowResult(true);
    if (optionId === currentQ.correctId) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        setGameOver(true);
      } else {
        setQuestionIndex((i) => i + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 1500);
  };

  const restart = () => {
    setQuestions(generateQuestions(animePool));
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white/40">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : percentage >= 40 ? '😊' : '😅';
    const message = percentage >= 80 ? 'Anime Master!' : percentage >= 60 ? 'Great job!' : percentage >= 40 ? 'Not bad!' : 'Keep watching more anime!';

    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="text-7xl mb-6">{emoji}</div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{message}</h1>
          <p className="text-white/50 mb-4">You scored</p>

          <div className="glass-strong rounded-3xl p-8 mb-8 inline-block">
            <div className="text-6xl font-display font-bold text-gradient mb-2">{score}/{questions.length}</div>
            <div className="text-sm text-white/40">{percentage}% correct</div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={restart} className="btn-primary flex items-center gap-2 relative z-10">
              <FiRefreshCw className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Play Again</span>
            </button>
            <Link to="/" className="btn-glass">Go Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Anime Quiz</h1>
          <p className="text-sm text-white/40">Guess the anime from the image</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <FiZap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-white">{score}</span>
            <span className="text-white/30">pts</span>
          </div>
          <div className="text-sm text-white/40">
            {questionIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          animate={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-strong rounded-3xl overflow-hidden mb-6">
            <div className="relative">
              <img
                src={currentQ.image}
                alt="Guess this anime"
                className="w-full h-64 md:h-80 object-cover"
                style={{ filter: showResult ? 'none' : 'brightness(0.7)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-lg font-display font-bold text-white">Which anime is this?</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, i) => {
              const isCorrect = option.mal_id === currentQ.correctId;
              const isSelected = selected === option.mal_id;
              let btnClass = 'glass glass-hover text-white/80';
              if (showResult) {
                if (isCorrect) btnClass = 'bg-green-500/20 border-green-500/40 text-green-400';
                else if (isSelected && !isCorrect) btnClass = 'bg-red-500/20 border-red-500/40 text-red-400';
                else btnClass = 'glass text-white/30';
              }

              return (
                <motion.button
                  key={option.mal_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleAnswer(option.mal_id)}
                  disabled={showResult}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left text-sm font-medium ${btnClass}`}
                >
                  {showResult && isCorrect && <FiCheck className="w-5 h-5 flex-shrink-0" />}
                  {showResult && isSelected && !isCorrect && <FiX className="w-5 h-5 flex-shrink-0" />}
                  <span className="truncate">{option.title}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
