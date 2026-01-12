import { describe, it, expect } from 'vitest';
import { Stats } from '../../../src/helpers/stats';

describe('STATS - TOP 3 USERS TEST', () => {
  it('computes top-3 users by error count', () => {
    const stats = new Stats();

    stats.consume({ logType: 'ERROR', userId: '5' });
    stats.consume({ logType: 'ERROR', userId: '5' });
    stats.consume({ logType: 'ERROR', userId: '5' });

    stats.consume({ logType: 'ERROR', userId: '17' });
    stats.consume({ logType: 'ERROR', userId: '17' });

    stats.consume({ logType: 'ERROR', userId: '42' });

    // extra user, who isn't in the top
    stats.consume({ logType: 'ERROR', userId: '9' });

    const result = stats.finalize();
    expect(result.topUsers).toEqual([
      { userId: '5', errors: 3 },
      { userId: '17', errors: 2 },
      { userId: '42', errors: 1 }
    ]);
  });

  it('breaks ties by userId asc', () => {
    const stats = new Stats();

    stats.consume({ logType: 'ERROR', userId: '20' });
    stats.consume({ logType: 'ERROR', userId: '20' });

    stats.consume({ logType: 'ERROR', userId: '3' });
    stats.consume({ logType: 'ERROR', userId: '3' });

    const result = stats.finalize();

    expect(result.topUsers).toEqual([
      { userId: '20', errors: 2 },
      { userId: '3', errors: 2 }
    ]);
  });
});
