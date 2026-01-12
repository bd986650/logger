import { LogType, ParsedLine } from '../types/types.js';

const LOG_PATTERN = /^(\S+)\s+(INFO|ERROR)/;
const LOG_TYPE_GROUP_INDEX = 2;

/**
 * Парсит строку лога и извлекает тип лога и пользователя.
 * 
 * Возвращает null для пустых и некорректных строк
 * Поддерживает несколько user= (берётся последний)
 * Обрабатывает значения с знаками равенства: user=test=value -> test=value
 */
export function parseLine(line: string): ParsedLine | null {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  const headerMatch = trimmedLine.match(LOG_PATTERN);
  if (!headerMatch) return null;

  const logType = headerMatch[LOG_TYPE_GROUP_INDEX] as LogType;

  const lastUserIndex = trimmedLine.lastIndexOf('user=');
  let userId: string | undefined;

  if (lastUserIndex !== -1) {
    const valueStart = lastUserIndex + 5;
    const valueEnd = trimmedLine.indexOf(' ', valueStart);
    userId = valueEnd === -1 ? trimmedLine.slice(valueStart) : trimmedLine.slice(valueStart, valueEnd);
  }

  return { logType, userId };
}
