import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { animeService } from '@/services/api/animeService';
import { topService } from '@/services/api/topService';
import { seasonService } from '@/services/api/seasonService';
import { cachedGet } from '@/services/api/jikanClient';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';

const GREETINGS = ['hi', 'hello', 'hey', 'yo', 'sup', 'hola', 'hii', 'hiii'];
const THANKS = ['thank', 'thanks', 'thx', 'ty', 'appreciate'];

const GENRE_KEYWORDS = [
  { words: ['action', 'fight', 'battle', 'combat', 'martial arts', 'sword'], genre: 1, label: 'Action' },
  { words: ['adventure', 'journey', 'quest', 'explore', 'travel'], genre: 2, label: 'Adventure' },
  { words: ['comedy', 'funny', 'laugh', 'humor', 'hilarious', 'joke'], genre: 4, label: 'Comedy' },
  { words: ['mystery', 'detective', 'crime', 'murder', 'clue', 'puzzle', 'whodunit'], genre: 7, label: 'Mystery' },
  { words: ['drama', 'emotional', 'cry', 'tears', 'sad', 'heartbreak', 'touching', 'moving'], genre: 8, label: 'Drama' },
  { words: ['fantasy', 'magic', 'wizard', 'witch', 'spell', 'dragon', 'elf', 'magical'], genre: 10, label: 'Fantasy' },
  { words: ['historical', 'history', 'samurai', 'medieval', 'ancient', 'war'], genre: 13, label: 'Historical' },
  { words: ['horror', 'scary', 'creepy', 'terrifying', 'fear', 'nightmare', 'zombie'], genre: 14, label: 'Horror' },
  { words: ['mecha', 'robot', 'gundam', 'mech'], genre: 18, label: 'Mecha' },
  { words: ['music', 'band', 'sing', 'song', 'idol', 'concert', 'piano', 'guitar'], genre: 19, label: 'Music' },
  { words: ['romance', 'love', 'romantic', 'relationship', 'couple', 'dating', 'kiss', 'crush'], genre: 22, label: 'Romance' },
  { words: ['school', 'student', 'highschool', 'high school', 'college', 'classroom'], genre: 23, label: 'School' },
  { words: ['sci-fi', 'scifi', 'science fiction', 'space', 'future', 'alien', 'technology', 'cyberpunk'], genre: 24, label: 'Sci-Fi' },
  { words: ['sports', 'sport', 'basketball', 'soccer', 'football', 'volleyball', 'baseball', 'boxing', 'tennis'], genre: 30, label: 'Sports' },
  { words: ['supernatural', 'ghost', 'demon', 'spirit', 'paranormal', 'psychic', 'powers'], genre: 37, label: 'Supernatural' },
  { words: ['slice of life', 'daily life', 'chill', 'relaxing', 'calm', 'peaceful', 'cozy', 'wholesome', 'healing'], genre: 36, label: 'Slice of Life' },
  { words: ['suspense', 'thriller', 'tense', 'psychological', 'mind game', 'dark', 'twisted', 'mindbending'], genre: 41, label: 'Suspense' },
];

const MOOD_TO_GENRE = {
  happy: { genre: 4, label: 'Comedy' },
  sad: { genre: 8, label: 'Drama' },
  excited: { genre: 1, label: 'Action' },
  bored: { genre: 4, label: 'Comedy' },
  scared: { genre: 14, label: 'Horror' },
  lonely: { genre: 22, label: 'Romance' },
  angry: { genre: 1, label: 'Action' },
  nostalgic: { genre: 36, label: 'Slice of Life' },
  curious: { genre: 7, label: 'Mystery' },
  inspired: { genre: 30, label: 'Sports' },
  adventurous: { genre: 2, label: 'Adventure' },
  thoughtful: { genre: 41, label: 'Suspense' },
  hyped: { genre: 1, label: 'Action' },
  relaxed: { genre: 36, label: 'Slice of Life' },
};

const SPECIFIC_REQUESTS = [
  { words: ['isekai', 'another world', 'reincarnated', 'transported', 'summoned'], search: 'isekai', label: 'Isekai' },
  { words: ['ninja', 'shinobi'], search: 'ninja', label: 'Ninja' },
  { words: ['pirate', 'pirates'], search: 'pirate', label: 'Pirate' },
  { words: ['vampire', 'vampires'], search: 'vampire', label: 'Vampire' },
  { words: ['superhero', 'hero', 'superpower'], search: 'hero', label: 'Superhero' },
  { words: ['cooking', 'food', 'chef', 'kitchen'], search: 'cooking', label: 'Cooking' },
  { words: ['harem'], search: 'harem', label: 'Harem' },
  { words: ['shounen', 'shonen'], search: 'shounen', label: 'Shounen' },
  { words: ['seinen'], search: 'seinen', label: 'Seinen' },
  { words: ['shoujo', 'shojo'], search: 'shoujo', label: 'Shoujo' },
];

function analyzeMessage(msg) {
  const lower = msg.toLowerCase().trim();

  if (GREETINGS.some((g) => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!'))) {
    return { type: 'greeting' };
  }

  if (THANKS.some((t) => lower.includes(t))) {
    return { type: 'thanks' };
  }

  if (/\b(top|best|highest rated|greatest)\b/.test(lower) && !/\b(genre|type|kind)\b/.test(lower)) {
    return { type: 'top' };
  }

  if (/\b(popular|trending|everyone|famous)\b/.test(lower)) {
    return { type: 'popular' };
  }

  if (/\b(new|latest|current|this season|airing now|currently airing|recent)\b/.test(lower)) {
    return { type: 'seasonal' };
  }

  if (/\b(character|who is|which anime is .+ from|which anime does .+ belong|what anime is .+ in|what anime has)\b/.test(lower)) {
    const charName = lower
      .replace(/\b(character|who is|which anime is|from|which anime does|belong to|what anime is|in|what anime has|tell me about|can you tell me|search|find)\b/g, '')
      .replace(/[?!.,]/g, '')
      .trim();
    if (charName.length > 1) {
      return { type: 'character', query: charName };
    }
  }

  for (const req of SPECIFIC_REQUESTS) {
    if (req.words.some((w) => lower.includes(w))) {
      return { type: 'specific', search: req.search, label: req.label };
    }
  }

  const matchedGenres = [];
  for (const entry of GENRE_KEYWORDS) {
    if (entry.words.some((w) => lower.includes(w))) {
      matchedGenres.push(entry);
    }
  }
  if (matchedGenres.length > 0) {
    return {
      type: 'genre',
      genres: matchedGenres.map((g) => g.genre),
      labels: matchedGenres.map((g) => g.label),
    };
  }

  for (const [mood, data] of Object.entries(MOOD_TO_GENRE)) {
    if (lower.includes(mood)) {
      return { type: 'mood', genre: data.genre, label: data.label, mood };
    }
  }

  const cleanWords = lower
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['want', 'like', 'show', 'anime', 'with', 'about', 'something', 'suggest', 'recommend', 'good', 'great', 'nice', 'cool', 'some', 'please', 'find', 'looking', 'watch', 'feel', 'feeling', 'mood', 'need', 'give', 'tell', 'can', 'you', 'for', 'the', 'and', 'that', 'this', 'what', 'are', 'any', 'have', 'has', 'get', 'got', 'really', 'very', 'also', 'more', 'know', 'would'].includes(w));

  if (cleanWords.length > 0) {
    return { type: 'text_search', query: cleanWords.join(' ') };
  }

  return { type: 'unknown' };
}

function AnimeResult({ anime, onClose }) {
  const image = anime.images?.webp?.image_url || anime.images?.jpg?.image_url;
  const title = anime.title_english || anime.title;
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      onClick={onClose}
      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <img src={image} alt="" className="w-10 h-14 rounded-lg object-cover border border-white/10 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate group-hover:text-primary-400 transition-colors">{title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {anime.score && <ScoreBadge score={anime.score} />}
          {anime.type && <span className="text-[9px] text-white/30 uppercase">{anime.type}</span>}
          {anime.episodes && <span className="text-[9px] text-white/30">{anime.episodes} eps</span>}
        </div>
      </div>
    </Link>
  );
}

function CharacterResult({ character, onClose }) {
  const image = character.images?.webp?.image_url || character.images?.jpg?.image_url;
  const animeAppearances = character.anime?.slice(0, 3) || [];

  return (
    <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--input-bg)' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <img src={image} alt="" className="w-10 h-14 rounded-lg object-cover border border-white/10 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Link
            to={`/character/${character.mal_id}`}
            onClick={onClose}
            className="text-xs font-bold text-white hover:text-primary-400 transition-colors"
          >
            {character.name}
          </Link>
          {character.name_kanji && <p className="text-[9px] text-white/30">{character.name_kanji}</p>}
        </div>
      </div>
      {animeAppearances.length > 0 && (
        <div className="space-y-1 border-t border-white/[0.06] pt-1.5 mt-1.5">
          <p className="text-[9px] text-white/40 uppercase font-medium">Appears in:</p>
          {animeAppearances.map((entry) => (
            <Link
              key={entry.anime.mal_id}
              to={`/anime/${entry.anime.mal_id}`}
              onClick={onClose}
              className="flex items-center gap-2 py-1 hover:bg-white/5 rounded-lg px-1 transition-colors"
            >
              <img
                src={entry.anime.images?.webp?.small_image_url || entry.anime.images?.jpg?.small_image_url}
                alt=""
                className="w-7 h-10 rounded object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/80 truncate">{entry.anime.title}</p>
                <Badge variant={entry.role === 'Main' ? 'accent' : 'default'} className="mt-0.5">{entry.role}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-primary-600 to-accent-600 rounded-br-md'
            : 'glass rounded-bl-md'
        }`}
        style={message.role === 'user' ? { color: 'white', WebkitTextFillColor: 'white' } : undefined}
      >
        <div className="whitespace-pre-line">{message.text}</div>
        {message.characters && message.characters.length > 0 && (
          <div className="mt-2 space-y-2 border-t border-white/10 pt-2">
            {message.characters.map((c) => (
              <CharacterResult key={c.mal_id} character={c} onClose={onClose} />
            ))}
          </div>
        )}
        {message.anime && message.anime.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
            {message.anime.map((a) => (
              <AnimeResult key={a.mal_id} anime={a} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AnimeChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hey! 👋 I'm AnimeBot — your personal anime guide.\n\nTell me what you're in the mood for!\n\nTry:\n• \"I want action anime\"\n• \"Something romantic and funny\"\n• \"I'm feeling sad\"\n• \"Best isekai anime\"\n• \"What's trending right now?\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const addBotMessage = (text, anime = [], characters = []) => {
    setMessages((prev) => [...prev, { role: 'bot', text, anime, characters }]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    const analysis = analyzeMessage(text);

    try {
      switch (analysis.type) {
        case 'greeting':
          addBotMessage("Hey there! 👋 Tell me what kind of anime you're looking for — a genre, a mood, or just describe what you want!");
          break;

        case 'thanks':
          addBotMessage("You're welcome! 😊 Happy watching! Let me know if you need more suggestions anytime 🍿");
          break;

        case 'top': {
          const data = await topService.getTopAnime({ limit: 5 });
          addBotMessage("Here are the highest rated anime of all time! 🏆", data.data || []);
          break;
        }

        case 'popular': {
          const data = await topService.getTopAnime({ filter: 'bypopularity', limit: 5 });
          addBotMessage("Here are the most popular anime! 🔥", data.data || []);
          break;
        }

        case 'seasonal': {
          const data = await seasonService.getCurrentSeason({ limit: 5 });
          addBotMessage("Here's what's airing this season! ✨", data.data || []);
          break;
        }

        case 'specific': {
          const data = await animeService.search({ q: analysis.search, order_by: 'score', sort: 'desc', limit: 5 });
          const results = data.data || [];
          if (results.length > 0) {
            addBotMessage(`Here are the best ${analysis.label} anime! 🎯`, results);
          } else {
            addBotMessage(`Couldn't find ${analysis.label} anime right now. Try a different description! 🔍`);
          }
          break;
        }

        case 'genre': {
          const genreIds = analysis.genres.slice(0, 2).join(',');
          const data = await animeService.search({ genres: genreIds, order_by: 'score', sort: 'desc', limit: 5 });
          const results = data.data || [];
          if (results.length > 0) {
            addBotMessage(`Great choice! Here are top ${analysis.labels.join(' + ')} anime for you! 🎬`, results);
          } else {
            addBotMessage(`No results for ${analysis.labels.join(' + ')} right now. Try another genre! 🔍`);
          }
          break;
        }

        case 'mood': {
          const data = await animeService.search({ genres: String(analysis.genre), order_by: 'score', sort: 'desc', limit: 5 });
          const results = data.data || [];
          if (results.length > 0) {
            addBotMessage(`Feeling ${analysis.mood}? Here are some ${analysis.label} anime to match your mood! 💫`, results);
          } else {
            addBotMessage(`Couldn't find the right match. Try describing what you want differently! 😊`);
          }
          break;
        }

        case 'character': {
          const charData = await cachedGet('/characters', { q: analysis.query, limit: 3, order_by: 'favorites', sort: 'desc' });
          const chars = charData.data || [];
          if (chars.length > 0) {
            const detailedChars = [];
            for (const c of chars.slice(0, 2)) {
              try {
                const full = await cachedGet(`/characters/${c.mal_id}/full`);
                detailedChars.push(full.data);
              } catch {
                detailedChars.push(c);
              }
            }
            addBotMessage(`Found this character! Here's where they appear: 🎭`, [], detailedChars);
          } else {
            addBotMessage(`Couldn't find a character named "${analysis.query}". Check the spelling and try again! 🔍`);
          }
          break;
        }

        case 'text_search': {
          const data = await animeService.search({ q: analysis.query, order_by: 'score', sort: 'desc', limit: 5 });
          const results = data.data || [];
          if (results.length > 0) {
            addBotMessage(`Here's what I found for "${analysis.query}" 🔍`, results);
          } else {
            const charFallback = await cachedGet('/characters', { q: analysis.query, limit: 2, order_by: 'favorites', sort: 'desc' });
            const chars = charFallback.data || [];
            if (chars.length > 0) {
              const detailedChars = [];
              for (const c of chars.slice(0, 2)) {
                try {
                  const full = await cachedGet(`/characters/${c.mal_id}/full`);
                  detailedChars.push(full.data);
                } catch {
                  detailedChars.push(c);
                }
              }
              addBotMessage(`I didn't find an anime with that title, but I found a character! 🎭`, [], detailedChars);
            } else {
              addBotMessage(`No results for "${analysis.query}". Try a genre like "action", "romance", or ask about a character like "who is Gojo Satoru" 😊`);
            }
          }
          break;
        }

        default:
          addBotMessage("I'm not sure what you mean 🤔\n\nTry saying:\n• A genre: \"action\", \"romance\", \"comedy\"\n• A mood: \"I feel sad\", \"I'm excited\"\n• A theme: \"isekai\", \"ninja\", \"space\"\n• Or: \"trending\", \"top rated\", \"this season\"");
      }
    } catch {
      addBotMessage("Oops! Something went wrong fetching anime. Try again in a moment! 😅");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] h-[500px] flex flex-col glass-strong rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-primary-600/10 to-accent-600/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AnimeBot</h3>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} onClose={() => setOpen(false)} />
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want to watch..."
                  className="flex-1 text-sm text-white placeholder-white/30 outline-none py-2.5 px-3 rounded-xl transition-all"
                  style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ color: 'white' }}
                >
                  <FiSend className="w-4 h-4" style={{ color: 'white', WebkitTextFillColor: 'white' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX className="w-6 h-6" style={{ color: 'white', WebkitTextFillColor: 'white' }} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle className="w-6 h-6" style={{ color: 'white', WebkitTextFillColor: 'white' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
