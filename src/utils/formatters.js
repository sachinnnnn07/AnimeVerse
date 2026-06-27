export function formatScore(score) {
  if (!score) return 'N/A';
  return score.toFixed(1);
}

export function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDuration(minutes) {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  return `${hours}h ${mins}m`;
}

export function truncateText(text, maxLength = 200) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getSeasonFromMonth(month) {
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall';
}

export function getCurrentSeason() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    season: getSeasonFromMonth(now.getMonth() + 1),
  };
}

export function getScoreColor(score) {
  if (!score) return 'text-gray-400';
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBg(score) {
  if (!score) return 'from-gray-600 to-gray-700';
  if (score >= 8) return 'from-green-500 to-emerald-600';
  if (score >= 6) return 'from-yellow-500 to-amber-600';
  if (score >= 4) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

export function getStatusColor(status) {
  const colors = {
    watching: 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    plan_to_watch: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    on_hold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
