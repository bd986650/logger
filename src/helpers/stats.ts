import type { ParsedLine, FinalStats } from '../types/types.js';

const TOP_LIMIT = 3;

/**
 * Класс для агрегации статистики по логам.
 */
export class Stats {
  private totalLines = 0;
  private errorLines = 0;
  private errorsByUser = new Map<string, number>();
  private topUsers: Array<{ userId: string; errors: number }> = [];

  /**
   * Обрабатывает одну строку лога и обновляет счётчики.
   */
  consume(parsedLine: ParsedLine | null): void {
    this.totalLines += 1;

    if (!parsedLine) return;
    if (parsedLine.logType !== 'ERROR') return;

    this.errorLines += 1;

    if (!parsedLine.userId) return;

    const newCount = (this.errorsByUser.get(parsedLine.userId) ?? 0) + 1;

    this.errorsByUser.set(parsedLine.userId, newCount);
    this.updateTopUsers(parsedLine.userId, newCount);
  }

  /**
   * Обновляет топ пользователей по количеству ошибок.
   */
  private updateTopUsers(userId: string, errors: number): void {
    const existingIndex = this.topUsers.findIndex((user) => user.userId === userId);

    if (existingIndex >= 0) {
      // пользователь уже в топе - обновляем счётчик
      this.topUsers[existingIndex].errors = errors;
    } else if (this.topUsers.length < TOP_LIMIT) {
      // топ ещё не заполнен - добавляем
      this.topUsers.push({ userId, errors });
    } else {
      // проверяем, может ли пользователь попасть в топ
      // находим минимальное значение ошибок в текущем топе
      let minErrors = this.topUsers[0].errors;
      let minIndex = 0;
      for (let i = 1; i < this.topUsers.length; i++) {
        if (this.topUsers[i].errors < minErrors) {
          minErrors = this.topUsers[i].errors;
          minIndex = i;
        }
      }

      // если новый пользователь имеет больше ошибок, меняем минимум
      if (errors > minErrors) {
        this.topUsers[minIndex] = { userId, errors };
      } else {
        return;
      }
    }

    this.topUsers.sort((a, b) => {
      if (b.errors !== a.errors) {
        return b.errors - a.errors;
      }
      return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
    });
  }

  /**
   * Возвращает финальную статистику.
   */
  finalize(): FinalStats {
    return {
      totalLines: this.totalLines,
      errorLines: this.errorLines,
      topUsers: [...this.topUsers]
    };
  }
}
