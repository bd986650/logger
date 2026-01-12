import fs from 'node:fs';

import { formatOutput } from './helpers/formatOutput.js';
import { runScript } from './runScript.js';

async function main(): Promise<void> {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Example usage: npm run dev -- ./example_data/data.log');
    process.exitCode = 1;
    return;
  }

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (error) {
    console.error(`Error: Cannot access file "${filePath}"`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      console.error(`Error: "${filePath}" is not a file`);
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.error(`Error: Cannot stat file "${filePath}"`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  try {
    const result = await runScript(filePath);
    process.stdout.write(formatOutput(result) + '\n');
  } catch (error) {
    console.error('Error processing file:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Unexpected error:');
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
