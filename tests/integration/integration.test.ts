import { describe, it, expect } from 'vitest';

import path from 'node:path';

import { runScript } from '../../src/runScript.js';
import { formatOutput } from '../../src/helpers/formatOutput.js';

describe('integration test', () => {
  it('', async () => {
    const filePath = path.resolve(process.cwd(), 'example_data', 'data.log');

    const result = await runScript(filePath);
    const output = formatOutput(result);

    expect(output).toBe(
      [
        'totalLines=14',
        'errorLines=7',
        'topUsersWithErrors=5:3,17:2,42:1'
      ].join('\n')
    );
  });
});
