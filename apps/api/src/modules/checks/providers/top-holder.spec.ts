import { topHolderPercent } from './top-holder';

describe('topHolderPercent', () => {
  it('computes percent from raw amounts', () => {
    expect(topHolderPercent(250n, 1000n)).toBe(25);
    expect(topHolderPercent('1', 3n)).toBe(33.33);
  });

  it('returns null for empty supply', () => {
    expect(topHolderPercent(10n, 0n)).toBeNull();
  });
});
