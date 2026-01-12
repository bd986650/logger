import { describe, it, expect } from 'vitest';
import { parseLine } from '../../../src/helpers/parseLine';

describe('PARSELINE – EDGE CASES TEST', () => {
  it('handles user= at the end of line', () => {
    const line = '2024-12-01T10:00:01Z ERROR action=pay user=99';
    const result = parseLine(line);

    expect(result?.userId).toBe('99');
  });

  it('handles user=value with equals sign in value', () => {
    const line = '2024-12-01T10:00:01Z ERROR user=test=value action=pay';
    const result = parseLine(line);

    expect(result?.userId).toBe('test=value');
  });

  it('handles empty line', () => {
    expect(parseLine('')).toBeNull();
    expect(parseLine('   ')).toBeNull();
  });

  it('handles garbage line', () => {
    expect(parseLine('garbage line')).toBeNull();
    expect(parseLine('just some garbage text')).toBeNull();
  });

  it('returns null if not enough tokens (no type)', () => {
    expect(parseLine('2024-12-01T10:00:01Z')).toBeNull();
  });

  it('returns null for unsupported type', () => {
    expect(parseLine('2024-12-01T10:00:01Z WARN user=42 action=login')).toBeNull();
  });
});
