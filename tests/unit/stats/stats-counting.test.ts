import { describe, it, expect } from 'vitest';
import { Stats } from '../../../src/helpers/stats';

describe('STATS - COUNTING TEST', () => {
  it('counts total lines even for null parsed', () => {
    const stats = new Stats();
    stats.consume(null);
    stats.consume(null);

    const result = stats.finalize();
    expect(result.totalLines).toBe(2);
    expect(result.errorLines).toBe(0);
    expect(result.topUsers).toEqual([]);
  });

  it('counts ERROR lines', () => {
    const stats = new Stats();

    stats.consume({ logType: 'INFO', userId: '1' });
    stats.consume({ logType: 'ERROR', userId: '1' });
    stats.consume({ logType: 'ERROR', userId: '2' });

    const result = stats.finalize();
    expect(result.totalLines).toBe(3);
    expect(result.errorLines).toBe(2);
  });

  it('does not count INFO as error', () => {
    const stats = new Stats();
    stats.consume({ logType: 'INFO', userId: '1' });
    stats.consume({ logType: 'INFO' });
    stats.consume({ logType: 'ERROR', userId: '1' });

    const result = stats.finalize();
    expect(result.totalLines).toBe(3);
    expect(result.errorLines).toBe(1);
    expect(result.topUsers).toEqual([{ userId: '1', errors: 1 }]);
  });
});
