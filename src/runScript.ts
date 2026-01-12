import { readLines } from './helpers/reader.js';
import { parseLine } from './helpers/parseLine.js';
import { Stats } from './helpers/stats.js';

import { FinalStats } from './types/types.js';

/**
 * Запускает обработку логов.
 * Читает файл, парсит строки и собирает статистику.
 */
export async function runScript(filePath: string): Promise<FinalStats> {
    const stats = new Stats();

    for await (const line of readLines(filePath)) {
        const parsed = parseLine(line);
        stats.consume(parsed);
    }

    return stats.finalize();
}
