import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiSearch, FiList } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';
import ScoreBadge from '@/components/ui/ScoreBadge';

export default function CustomListsPage() {
  const [lists, setLists] = useLocalStorage('animeverse-lists', []);
  const [activeList, setActiveList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);

  useState(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    animeService.search({ q: debouncedQuery, limit: 6, order_by: 'popularity', sort: 'asc' })
      .then((data) => setSearchResults(data.data || []))
      .catch(() => {})
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  const createList = () => {
    if (!newListName.trim()) return;
    const newList = { id: Date.now(), name: newListName.trim(), anime: [], createdAt: Date.now() };
    setLists((prev) => [...prev, newList]);
    setNewListName('');
    setShowCreate(false);
    setActiveList(newList.id);
  };

  const deleteList = (id) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    if (activeList === id) setActiveList(null);
  };

  const addAnimeToList = (listId, anime) => {
    const entry = {
      mal_id: anime.mal_id,
      title: anime.title_english || anime.title,
      image: anime.images?.webp?.image_url || anime.images?.jpg?.image_url,
      score: anime.score,
      type: anime.type,
    };
    setLists((prev) => prev.map((l) => {
      if (l.id !== listId) return l;
      if (l.anime.some((a) => a.mal_id === entry.mal_id)) return l;
      return { ...l, anime: [...l.anime, entry] };
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeAnimeFromList = (listId, malId) => {
    setLists((prev) => prev.map((l) => {
      if (l.id !== listId) return l;
      return { ...l, anime: l.anime.filter((a) => a.mal_id !== malId) };
    }));
  };

  const currentList = lists.find((l) => l.id === activeList);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Custom Lists</h1>
        <p className="text-white/40">Create personalized anime collections</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/60">Your Lists</h3>
            <button onClick={() => setShowCreate(!showCreate)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
              <FiPlus className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {showCreate && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-3 overflow-hidden">
                <div className="flex gap-2">
                  <input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createList()}
                    placeholder="List name..."
                    className="flex-1 text-sm text-white placeholder-white/30 outline-none py-2 px-3 rounded-lg"
                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
                    autoFocus
                  />
                  <button onClick={createList} className="px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium">Add</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {lists.length === 0 ? (
              <p className="text-xs text-white/20 italic py-4 text-center">No lists yet. Create one!</p>
            ) : (
              lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setActiveList(list.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                    activeList === list.id ? 'glass-strong text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FiList className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{list.name}</span>
                  </div>
                  <span className="text-[10px] text-white/30 flex-shrink-0">{list.anime.length}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          {currentList ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-white">{currentList.name}</h2>
                <button onClick={() => deleteList(currentList.id)} className="flex items-center gap-1 text-xs text-red-400/60 hover:text-red-400 transition-colors">
                  <FiTrash2 className="w-3.5 h-3.5" /> Delete List
                </button>
              </div>

              <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length >= 2) {
                      setSearching(true);
                      animeService.search({ q: e.target.value, limit: 6, order_by: 'popularity', sort: 'asc' })
                        .then((data) => setSearchResults(data.data || []))
                        .catch(() => {})
                        .finally(() => setSearching(false));
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="Search anime to add..."
                  className="w-full text-sm text-white placeholder-white/30 outline-none py-2.5 pl-10 pr-4 rounded-xl"
                  style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-20 shadow-xl">
                    {searchResults.map((anime) => (
                      <button
                        key={anime.mal_id}
                        onClick={() => addAnimeToList(currentList.id, anime)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
                      >
                        <img src={anime.images?.webp?.small_image_url} alt="" className="w-8 h-11 rounded object-cover" />
                        <span className="text-sm text-white/80 truncate flex-1">{anime.title_english || anime.title}</span>
                        <FiPlus className="w-4 h-4 text-primary-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentList.anime.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <span className="text-4xl block mb-3">📝</span>
                  <p className="text-sm">This list is empty. Search above to add anime!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {currentList.anime.map((anime, i) => (
                    <motion.div key={anime.mal_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="relative group">
                      <Link to={`/anime/${anime.mal_id}`} className="block rounded-xl overflow-hidden border border-white/[0.06] hover:border-primary-500/30 transition-all">
                        <img src={anime.image} alt="" className="w-full aspect-[3/4] object-cover" loading="lazy" />
                        <div className="p-2">
                          <p className="text-xs font-medium text-white truncate">{anime.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {anime.score && <ScoreBadge score={anime.score} />}
                            {anime.type && <span className="text-[9px] text-white/30 uppercase">{anime.type}</span>}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeAnimeFromList(currentList.id, anime.mal_id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20 text-white/30">
              <FiList className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">{lists.length > 0 ? 'Select a list to view' : 'Create your first list to get started'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
