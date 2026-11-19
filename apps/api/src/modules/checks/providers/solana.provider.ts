import type { ScoreInput } from '../domain/risk-score';

/**
 * Adapter boundary for Solana RPC / indexer data.
 * MVP stub returns deterministic placeholder signals so the product wiring works locally.
 */
export class SolanaTokenProvider {
  async fetchScoreInput(address: string): Promise<{
    input: ScoreInput;
    sources: string[];
  }> {
    // Deterministic stub based on address shape — replace with real RPC/indexer next.
    const seed = [...address].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const mintAuthorityActive = seed % 3 === 0;
    const freezeAuthorityActive = seed % 5 === 0;
    const lpLockedOrBurned = seed % 4 !== 0;
    const topHolderPct = 15 + (seed % 50);
    const liquidityUsd = 2_000 + (seed % 80_000);
    const ageHours = 2 + (seed % 240);

    return {
      input: {
        mintAuthorityActive,
        freezeAuthorityActive,
        lpLockedOrBurned,
        topHolderPct,
        liquidityUsd,
        ageHours,
      },
      sources: ['stub:solana-provider'],
    };
  }
}
