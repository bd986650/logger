import type { FinalStats } from '../types/types.js';

/**
 * Форматирует итоговую статистику в текстовый вид.
 */
export function formatOutput(s: FinalStats): string {
  const topUsers = s.topUsers.map((user) => `${user.userId}:${user.errors}`).join(',');

  return [
    `totalLines=${s.totalLines}`,
    `errorLines=${s.errorLines}`,
    `topUsersWithErrors=${topUsers}`
  ].join('\n');
}
