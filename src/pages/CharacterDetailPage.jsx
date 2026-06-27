import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiUser } from 'react-icons/fi';
import { characterService } from '@/services/api/characterService';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/utils/formatters';

export default function CharacterDetailPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    characterService.getById(id)
      .then((data) => setCharacter(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-64 aspect-[3/4] rounded-2xl flex-shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!character) return null;

  const image = character.images?.webp?.image_url || character.images?.jpg?.image_url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 mx-auto md:mx-0"
        >
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-xl rounded-3xl" />
            <img
              src={image}
              alt={character.name}
              className="relative w-52 md:w-64 rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            {character.name}
          </h1>
          {character.name_kanji && (
            <p className="text-lg text-white/40 mb-4">{character.name_kanji}</p>
          )}

          {character.nicknames?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {character.nicknames.map((nick) => (
                <Badge key={nick}>{nick}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-accent-400">
              <FiHeart className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(character.favorites)} favorites</span>
            </div>
          </div>

          {character.about && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">About</h3>
              <p className={`text-sm text-white/50 leading-relaxed whitespace-pre-line ${!bioExpanded ? 'line-clamp-[8]' : ''}`}>
                {character.about}
              </p>
              {character.about.length > 500 && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="text-xs text-primary-400 hover:text-primary-300 mt-2"
                >
                  {bioExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {character.voices?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Voice Actors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {character.voices.map((va, i) => (
              <motion.div
                key={`${va.person.mal_id}-${va.language}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 glass rounded-xl p-3"
              >
                <img
                  src={va.person.images?.jpg?.image_url}
                  alt={va.person.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{va.person.name}</p>
                  <Badge variant="primary" className="mt-1">{va.language}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {character.anime?.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-6">Anime Appearances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {character.anime.map((entry, i) => (
              <motion.div
                key={entry.anime.mal_id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/anime/${entry.anime.mal_id}`}
                  className="flex items-center gap-3 glass rounded-xl p-3 glass-hover"
                >
                  <img
                    src={entry.anime.images?.webp?.image_url || entry.anime.images?.jpg?.image_url}
                    alt={entry.anime.title}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{entry.anime.title}</p>
                    <Badge variant={entry.role === 'Main' ? 'accent' : 'default'} className="mt-1">
                      {entry.role}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
