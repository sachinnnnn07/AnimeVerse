import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiTv, FiCalendar } from 'react-icons/fi';
import { seasonService } from '@/services/api/seasonService';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

function getNextBroadcast(broadcast) {
  if (!broadcast?.day || !broadcast?.time) return null;
  const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
  const dayIndex = days.indexOf(broadcast.day);
  if (dayIndex === -1) return null;

  const [hours, minutes] = broadcast.time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const now = new Date();
  const jstOffset = 9 * 60;
  const localOffset = now.getTimezoneOffset();
  const jstNow = new Date(now.getTime() + (jstOffset + localOffset) * 60000);

  let target = new Date(jstNow);
  target.setHours(hours, minutes, 0, 0);

  const currentDay = jstNow.getDay();
  let daysUntil = dayIndex - currentDay;
  if (daysUntil < 0) daysUntil += 7;
  if (daysUntil === 0 && jstNow > target) daysUntil = 7;

  target.setDate(target.getDate() + daysUntil);

  const targetUTC = new Date(target.getTime() - (jstOffset + localOffset) * 60000);
  return targetUTC;
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="w-11 h-11 rounded-lg glass flex items-center justify-center text-sm font-bold text-white font-display">
            {String(u.value).padStart(2, '0')}
          </div>
          <span className="text-[9px] text-white/30 mt-0.5 block">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CountdownPage() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seasonService.getCurrentSeason({ limit: 25, filter: 'tv' })
      .then((data) => {
        const airing = (data.data || []).filter((a) => a.airing && a.broadcast?.day && a.broadcast?.time);
        airing.sort((a, b) => {
          const nextA = getNextBroadcast(a.broadcast);
          const nextB = getNextBroadcast(b.broadcast);
          if (!nextA) return 1;
          if (!nextB) return -1;
          return nextA.getTime() - nextB.getTime();
        });
        setAnime(airing);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Episode Countdown
        </h1>
        <p className="text-white/40">Countdown to the next episode of currently airing anime</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 glass rounded-2xl p-4">
              <Skeleton className="w-14 h-20 rounded-xl" />
              <div className="flex-1 space-y-2"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-3 w-1/4" /></div>
            </div>
          ))}
        </div>
      ) : anime.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <span className="text-5xl block mb-4">⏰</span>
          <p>No airing anime with schedule data found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {anime.map((item, i) => {
            const image = item.images?.webp?.image_url || item.images?.jpg?.image_url;
            const title = item.title_english || item.title;
            const nextDate = getNextBroadcast(item.broadcast);

            return (
              <motion.div
                key={item.mal_id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/anime/${item.mal_id}`} className="flex items-center gap-4 glass rounded-2xl p-4 glass-hover">
                  <img src={image} alt={title} className="w-14 h-20 rounded-xl object-cover border border-white/10" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="neon"><FiCalendar className="w-3 h-3" /> {item.broadcast.day} {item.broadcast.time} JST</Badge>
                      {item.episodes && <Badge><FiTv className="w-3 h-3" /> {item.episodes} eps</Badge>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 hidden sm:block">
                    {nextDate && <CountdownTimer targetDate={nextDate} />}
                  </div>
                  <div className="flex-shrink-0 sm:hidden">
                    <ScoreBadge score={item.score} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
