import { describe, it, expect } from 'vitest';

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { runScript } from '../../src/runScript';

describe('large file test', () => {
  it('', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'logger-'));
    const filePath = path.join(tmpDir, 'big.log');

    const lines: string[] = [];
    const total = 100000;

    // 60k INFO logs
    for (let i = 0; i < 60000; i++) {
      lines.push(
        `2024-12-01T10:00:${String(i % 60).padStart(2, '0')}Z INFO user=1 action=view`
      );
    }

    // 30k ERROR user=5 logs
    for (let i = 0; i < 30000; i++) {
      lines.push(
        `2024-12-01T11:00:${String(i % 60).padStart(2, '0')}Z ERROR user=5 action=pay`
      );
    }

    // 10k ERROR user=17 logs
    for (let i = 0; i < 10000; i++) {
      lines.push(
        `2024-12-01T12:00:${String(i % 60).padStart(2, '0')}Z ERROR user=17 action=pay`
      );
    }

    expect(lines.length).toBe(total);

    await fs.writeFile(filePath, lines.join('\n') + '\n', 'utf8');

    const result = await runScript(filePath);

    expect(result.totalLines).toBe(total);
    expect(result.errorLines).toBe(40000);
    expect(result.topUsers).toEqual([
      { userId: '5', errors: 30000 },
      { userId: '17', errors: 10000 }
    ]);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
