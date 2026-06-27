import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiBookmark, FiStar, FiHeart, FiUsers, FiTv, FiCalendar, FiClock, FiBarChart2, FiChevronDown } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import useRecentStore from '@/store/useRecentStore';
import ReviewSection from '@/components/user/ReviewSection';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber, formatDate, formatScore, getScoreColor } from '@/utils/formatters';

function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const end = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(end)) return;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  if (typeof value === 'number' && value > 100) return formatNumber(Math.round(count));
  if (typeof value === 'number') return count.toFixed(1);
  return value;
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-4 text-center"
    >
      <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-bold text-white font-display">
        <AnimatedCounter value={value} />
      </div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
    </motion.div>
  );
}

const TABS = ['Overview', 'Characters', 'Reviews', 'Recommendations'];

export default function AnimeDetailPage() {
  const { id } = useParams();
  const addRecent = useRecentStore((s) => s.addItem);
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAnime(null);
    setActiveTab('Overview');
    window.scrollTo(0, 0);

    animeService.getById(id)
      .then((data) => {
        setAnime(data.data);
        if (data.data) addRecent(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    animeService.getCharacters(id)
      .then((data) => setCharacters(data.data || []))
      .catch(() => {});

    animeService.getRecommendations(id)
      .then((data) => setRecommendations(data.data || []))
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-72 aspect-[3/4] rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😵</span>
          <h2 className="text-xl font-bold text-white">Anime not found</h2>
        </div>
      </div>
    );
  }

  const bannerImage = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const title = anime.title_english || anime.title;
  const mainCharacters = characters.filter((c) => c.role === 'Main').slice(0, 12);
  const supportingCharacters = characters.filter((c) => c.role === 'Supporting').slice(0, 12);
  const allCharacters = [...mainCharacters, ...supportingCharacters];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImage} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-dark" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 mx-auto md:mx-0"
            >
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={bannerImage}
                  alt={title}
                  className="relative w-52 md:w-64 rounded-2xl shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {anime.type && <Badge variant="primary">{anime.type}</Badge>}
                {anime.status && (
                  <Badge variant={anime.status === 'Currently Airing' ? 'success' : 'default'}>
                    {anime.status}
                  </Badge>
                )}
                {anime.rating && <Badge>{anime.rating}</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 leading-tight">
                {title}
              </h1>
              {anime.title !== title && (
                <p className="text-sm text-white/40 mb-4">{anime.title}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/50">
                {anime.score && (
                  <div className="flex items-center gap-1.5">
                    <FiStar className={`w-4 h-4 ${getScoreColor(anime.score)}`} />
                    <span className="font-bold text-white">{anime.score}</span>
                    <span className="text-white/30">({formatNumber(anime.scored_by)})</span>
                  </div>
                )}
                {anime.rank && (
                  <span>Ranked <span className="font-bold text-white">#{anime.rank}</span></span>
                )}
                {anime.popularity && (
                  <span>Popularity <span className="font-bold text-white">#{anime.popularity}</span></span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres?.map((genre) => (
                  <Link
                    key={genre.mal_id}
                    to={`/browse?genre=${genre.mal_id}`}
                    className="px-3 py-1 rounded-full text-xs font-medium glass text-white/70 hover:text-white hover:border-primary-500/30 transition-all"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {anime.episodes && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <FiTv className="w-4 h-4 text-primary-400" />
                    <span>{anime.episodes} Episodes</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <FiClock className="w-4 h-4 text-accent-400" />
                    <span>{anime.duration}</span>
                  </div>
                )}
                {anime.aired?.string && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <FiCalendar className="w-4 h-4 text-neon-blue" />
                    <span>{anime.aired.string}</span>
                  </div>
                )}
                {anime.studios?.[0] && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <FiBarChart2 className="w-4 h-4 text-neon-green" />
                    <span>{anime.studios[0].name}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {anime.trailer?.youtube_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2 text-sm relative z-10"
                  >
                    <FiPlay className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Watch Trailer</span>
                  </a>
                )}
                <button className="btn-glass flex items-center gap-2 text-sm">
                  <FiBookmark className="w-4 h-4" /> Add to Watchlist
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 mb-8 overflow-x-auto hide-scrollbar border-b border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="detail-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {anime.synopsis && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-display font-bold text-white mb-3">Synopsis</h3>
                  <p className={`text-sm text-white/60 leading-relaxed ${!synopsisExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    {anime.synopsis}
                  </p>
                  {anime.synopsis.length > 300 && (
                    <button
                      onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                      className="md:hidden flex items-center gap-1 mt-2 text-xs text-primary-400 hover:text-primary-300"
                    >
                      {synopsisExpanded ? 'Show less' : 'Read more'}
                      <FiChevronDown className={`w-3 h-3 transition-transform ${synopsisExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard icon={FiStar} label="Score" value={anime.score} color="text-yellow-400" />
                <StatCard icon={FiBarChart2} label="Ranked" value={anime.rank ? `#${anime.rank}` : 'N/A'} color="text-primary-400" />
                <StatCard icon={FiUsers} label="Members" value={anime.members} color="text-neon-blue" />
                <StatCard icon={FiHeart} label="Favorites" value={anime.favorites} color="text-accent-400" />
              </div>

              {anime.background && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-display font-bold text-white mb-3">Background</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{anime.background}</p>
                </div>
              )}

              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-white mb-4">Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Type', value: anime.type },
                    { label: 'Episodes', value: anime.episodes || 'Unknown' },
                    { label: 'Status', value: anime.status },
                    { label: 'Aired', value: anime.aired?.string },
                    { label: 'Duration', value: anime.duration },
                    { label: 'Rating', value: anime.rating },
                    { label: 'Source', value: anime.source },
                    { label: 'Season', value: anime.season ? `${anime.season} ${anime.year}` : null },
                    { label: 'Studios', value: anime.studios?.map((s) => s.name).join(', ') },
                    { label: 'Producers', value: anime.producers?.map((p) => p.name).join(', ') },
                  ]
                    .filter((item) => item.value)
                    .map((item) => (
                      <div key={item.label} className="flex gap-2">
                        <span className="text-white/30 min-w-[90px]">{item.label}:</span>
                        <span className="text-white/70">{item.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              {(anime.theme?.openings?.length > 0 || anime.theme?.endings?.length > 0) && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-display font-bold text-white mb-4">Theme Songs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {anime.theme?.openings?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-primary-400 mb-2">Openings</h4>
                        <ul className="space-y-1.5">
                          {anime.theme.openings.map((op, i) => (
                            <li key={i} className="text-xs text-white/50">{op}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {anime.theme?.endings?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-accent-400 mb-2">Endings</h4>
                        <ul className="space-y-1.5">
                          {anime.theme.endings.map((ed, i) => (
                            <li key={i} className="text-xs text-white/50">{ed}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {anime.relations?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-display font-bold text-white mb-4">Related Anime</h3>
                  <div className="space-y-3">
                    {anime.relations.map((relation, i) => (
                      <div key={i}>
                        <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">{relation.relation}</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {relation.entry.map((entry) => (
                            <Link
                              key={entry.mal_id}
                              to={entry.type === 'anime' ? `/anime/${entry.mal_id}` : '#'}
                              className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                              {entry.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {allCharacters.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <span className="text-4xl block mb-3">🎭</span>
                  No character data available
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCharacters.map((char, i) => (
                    <motion.div
                      key={char.character.mal_id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={`/character/${char.character.mal_id}`}
                        className="flex items-center gap-3 glass rounded-xl p-3 glass-hover"
                      >
                        <img
                          src={char.character.images?.webp?.image_url || char.character.images?.jpg?.image_url}
                          alt={char.character.name}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{char.character.name}</p>
                          <Badge variant={char.role === 'Main' ? 'accent' : 'default'} className="mt-1">
                            {char.role}
                          </Badge>
                        </div>
                        {char.voice_actors?.[0] && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-xs text-white/50 truncate max-w-[80px]">{char.voice_actors[0].person.name}</p>
                              <p className="text-[10px] text-white/30">{char.voice_actors[0].language}</p>
                            </div>
                            <img
                              src={char.voice_actors[0].person.images?.jpg?.image_url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-white/10"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ReviewSection animeId={anime.mal_id} animeName={title} />
            </motion.div>
          )}

          {activeTab === 'Recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {recommendations.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <span className="text-4xl block mb-3">🔮</span>
                  No recommendations available
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {recommendations.slice(0, 18).map((rec, i) => {
                    const recAnime = rec.entry;
                    return (
                      <motion.div
                        key={recAnime.mal_id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={`/anime/${recAnime.mal_id}`} className="group block">
                          <div className="relative rounded-2xl overflow-hidden bg-dark-card border border-white/[0.06] group-hover:border-primary-500/30 transition-all">
                            <img
                              src={recAnime.images?.webp?.large_image_url || recAnime.images?.jpg?.large_image_url}
                              alt={recAnime.title}
                              loading="lazy"
                              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="p-3">
                              <p className="text-xs font-medium text-white/80 line-clamp-2">{recAnime.title}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
