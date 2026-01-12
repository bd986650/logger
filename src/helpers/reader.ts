import fs from 'node:fs';
import readline from 'node:readline';

const MAX_LINE_LENGTH = 10_000; // Максимальная длина строки 10KB
const BUFFER_SIZE = 64 * 1024; // Размер буфера 64KB для больших файлов

/**
 * Асинхронно читает файл построчно с использованием стримов.
 */
export async function* readLines(filePath: string): AsyncGenerator<string> {
  /**
   * Поток для чтения файла
   */
  const stream = fs.createReadStream(filePath, {
    encoding: 'utf8',
    highWaterMark: BUFFER_SIZE
  });

  /**
   * Интерфейс readline для построчного чтения
   */
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  /**
   * Итерация по строкам
   * Пропускает длинные строки
   */
  for await (const line of rl) {
    if (line.length > MAX_LINE_LENGTH) {
      continue;
    }

    yield line;
  }
}
