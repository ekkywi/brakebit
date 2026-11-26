import { sumSolanaLiquidity } from './market-liquidity';

describe('sumSolanaLiquidity', () => {
  it('adds Solana pools and ignores other chains', () => {
    expect(
      sumSolanaLiquidity([
        { chainId: 'solana', liquidity: { usd: 100 } },
        { chainId: 'solana', liquidity: { usd: 50.4 } },
        { chainId: 'ethereum', liquidity: { usd: 999 } },
      ]),
    ).toBe(150);
  });

  it('returns null when no pool reports a value, never 0', () => {
    expect(sumSolanaLiquidity([])).toBeNull();
    expect(
      sumSolanaLiquidity([{ chainId: 'solana', liquidity: { usd: null } }]),
    ).toBeNull();
  });
});
