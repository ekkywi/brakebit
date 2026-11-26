import { lpLockedSharePct, lpLockState } from './lp-lock';

const LP = 'LpMint1111111111111111111111111111111111111';
const SYSTEM = '11111111111111111111111111111111';

describe('lpLockState', () => {
  it('returns null when no pool has an LP token', () => {
    expect(
      lpLockState([{ lp: { lpMint: SYSTEM, lpLockedPct: 0, quoteUSD: 5000 } }]),
    ).toBeNull();
  });

  it('weights by USD: a large locked pool outweighs a small open one', () => {
    const markets = [
      { lp: { lpMint: LP, lpLockedPct: 100, quoteUSD: 1000 } },
      { lp: { lpMint: LP, lpLockedPct: 0, quoteUSD: 10 } },
    ];
    expect(lpLockedSharePct(markets)).toBeCloseTo((1000 * 100) / 1010, 5);
    expect(lpLockState(markets)).toBe(true);
  });

  it('is false when the USD-weighted share is below 95', () => {
    const markets = [
      { lp: { lpMint: LP, lpLockedPct: 0, quoteUSD: 1000 } },
      { lp: { lpMint: LP, lpLockedPct: 100, quoteUSD: 500 } },
    ];
    expect(lpLockState(markets)).toBe(false);
  });

  it('is null when any pool has a partial locked share (not verified yet)', () => {
    const markets = [
      { lp: { lpMint: LP, lpLockedPct: 100, quoteUSD: 1000 } },
      { lp: { lpMint: LP, lpLockedPct: 57.94, quoteUSD: 10 } },
    ];
    expect(lpLockedSharePct(markets)).toBeNull();
    expect(lpLockState(markets)).toBeNull();
  });

  it('is null when a pool has no locked share or no USD value', () => {
    expect(
      lpLockState([{ lp: { lpMint: LP, lpLockedPct: null, quoteUSD: 100 } }]),
    ).toBeNull();
    expect(
      lpLockState([{ lp: { lpMint: LP, lpLockedPct: 100, quoteUSD: null } }]),
    ).toBeNull();
  });

  it('is null when the total USD weight is zero', () => {
    expect(
      lpLockState([{ lp: { lpMint: LP, lpLockedPct: 100, quoteUSD: 0 } }]),
    ).toBeNull();
  });
});
