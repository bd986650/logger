import { describe, it, expect } from 'vitest';
import { Stats } from '../../../src/helpers/stats';

describe('STATS - EDGE CASES TEST', () => {
  it('handles many users with errors (top-3 optimization)', () => {
    const stats = new Stats();

    for (let i = 1; i <= 20; i++) {
      for (let j = 0; j < i; j++) {
        stats.consume({ logType: 'ERROR', userId: String(i) });
      }
    }

    const result = stats.finalize();

    expect(result.topUsers).toEqual([
      { userId: '20', errors: 20 },
      { userId: '19', errors: 19 },
      { userId: '18', errors: 18 }
    ]);
  });

  it('handles tie-breaking correctly with many users', () => {
    const stats = new Stats();

    stats.consume({ logType: 'ERROR', userId: '20' });
    stats.consume({ logType: 'ERROR', userId: '20' });
    stats.consume({ logType: 'ERROR', userId: '3' });
    stats.consume({ logType: 'ERROR', userId: '3' });
    stats.consume({ logType: 'ERROR', userId: '100' });
    stats.consume({ logType: 'ERROR', userId: '100' });

    const result = stats.finalize();

    expect(result.topUsers.length).toBe(3);
    expect(result.topUsers[0].errors).toBe(2);
    expect(result.topUsers[1].errors).toBe(2);
    expect(result.topUsers[2].errors).toBe(2);
  });

  it('handles single user with many errors', () => {
    const stats = new Stats();

    for (let i = 0; i < 1000; i++) {
      stats.consume({ logType: 'ERROR', userId: '1' });
    }

    const result = stats.finalize();

    expect(result.errorLines).toBe(1000);
    expect(result.topUsers).toEqual([{ userId: '1', errors: 1000 }]);
  });
});
