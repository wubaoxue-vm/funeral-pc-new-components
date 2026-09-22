export function formatRelativeTime(value) {
  if (!value) return "";
  const targetDate = new Date(value);
  if (isNaN(targetDate.getTime())) return value;

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const isFuture = diffMs > 0;

  // 绝对时间差
  const diffSec = Math.abs(diffMs) / 1000;
  const diffMin = diffSec / 60;
  const diffHour = diffMin / 60;

  // 自然日（历法）差值计算：消除时分秒的影响
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetZero = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const dayDiff = (targetZero - todayZero) / (1000 * 60 * 60 * 24);

  // 1. 当天内的逻辑（今天）
  if (dayDiff === 0) {
    if (diffMin < 1) return isFuture ? "即将" : "刚刚";
    if (diffMin < 60) return `${Math.floor(diffMin)}分钟${isFuture ? "后" : "前"}`;
    return `${Math.floor(diffHour)}小时${isFuture ? "后" : "前"}`;
  }

  // 2. 相邻几天（昨天、明天、前天、后天）
  if (dayDiff === 1) return "明天";
  if (dayDiff === 2) return "后天";
  if (dayDiff === -1) return "昨天";
  if (dayDiff === -2) return "前天";

  // 3. 几天前/后 (30天内)
  const absDayDiff = Math.abs(dayDiff);
  if (absDayDiff < 30) return `${absDayDiff}天${isFuture ? "后" : "前"}`;

  // 4. 几个月前/后 (12个月内)
  const monthDiff = Math.abs((targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth());
  if (monthDiff > 0 && monthDiff < 12) return `${monthDiff}个月${isFuture ? "后" : "前"}`;

  // 5. 几年前/后
  const yearDiff = Math.abs(targetDate.getFullYear() - now.getFullYear());
  return `${yearDiff}年${isFuture ? "后" : "前"}`;
}
