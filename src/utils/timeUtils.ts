export const formatDuration = (seconds: number, lang='en') => {
    const units = {
    en: ['second', 'minute', 'hour', 'day'],
    ja: ['秒', '分', '時間', '日']
  };
  let days = Math.floor(seconds / (86400));
  let hours = Math.floor((seconds / (3600)) % 24);
  let minutes = Math.floor((seconds / 60) % 60);

  let parts = [];
  if (days > 0) {
    parts.push(`${days} day${days>1?'s':''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours>1?'s':''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes>1?'s':''}`);
  }

  if (parts.length === 0) {
    return '0 seconds';
  }

  if (parts.length === 1) {
    return parts[0]
  }

  return parts.slice(0, -1).join(', ') + ' and ' + parts.slice(-1);
};