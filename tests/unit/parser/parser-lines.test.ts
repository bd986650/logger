import { describe, it, expect } from 'vitest';
import { parseLine } from '../../../src/helpers/parseLine';

describe('PARSELINE - VALID LINES TEST', () => {
  it('parses INFO line with user', () => {
    const line = '2024-12-01T10:00:01Z INFO user=42 action=login';
    expect(parseLine(line)).toEqual({ logType: 'INFO', userId: '42' });
  });

  it('handles very long lines', () => {
    const line ='2024-12-01T10:00:01Z INFO ' + 'x'.repeat(10000) + ' user=42';
    const result = parseLine(line);

    expect(result).not.toBeNull();
    expect(result?.logType).toBe('INFO');
    expect(result?.userId).toBe('42');
  });

  it('handles extra spaces', () => {
    const line = '  2024-12-01T10:00:01Z   INFO   user=42   action=login  ';
    expect(parseLine(line)).toEqual({ logType: 'INFO', userId: '42' });
  });

  it('keeps userId as string', () => {
    const line = '2024-12-01T10:00:03Z ERROR user=001 action=pay';
    expect(parseLine(line)).toEqual({ logType: 'ERROR', userId: '001' });
  });
});
