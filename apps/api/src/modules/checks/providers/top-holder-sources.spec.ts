import { topHolderPercent } from './top-holder';

describe('top-holder source helpers', () => {
  it('keeps RPC percent math stable for known amounts', () => {
    // Mirrors a mid-size mint: top raw / supply → 2-decimal pct
    expect(topHolderPercent(103900n, 1_000_000n)).toBe(10.39);
  });
});
