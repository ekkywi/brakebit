import type { Connection, PublicKey } from '@solana/web3.js';

export type MintAgeLookup = {
  ageHours: number | null;
  source?: string;
  note?: string;
  /** Fixed, user-facing reason when ageHours is null. */
  reason?: string;
};

const NO_HISTORY_REASON = 'No transaction history was found for this mint.';
const LONG_HISTORY_REASON =
  'The history is longer than one RPC page, so the exact age is not read yet.';
const RPC_REASON = 'Mint age could not be read from RPC for this mint.';

/**
 * Estimate mint age from the oldest signature returned for the mint account.
 * Phase 1: one page (up to 1000). Enough for brand-new / quiet mints.
 * Famous old mints may need pagination later (or stay unknown).
 */
export async function fetchMintAgeHours(
  connection: Connection,
  mintPubkey: PublicKey,
): Promise<MintAgeLookup> {
  try {
    const sigs = await connection.getSignaturesForAddress(mintPubkey, {
      limit: 1000,
    });

    if (sigs.length === 0) {
      return {
        ageHours: null,
        note: 'Mint age unavailable: no signatures for this mint.',
        reason: NO_HISTORY_REASON,
      };
    }

    const oldest = sigs[sigs.length - 1];
    if (oldest.blockTime == null) {
      return {
        ageHours: null,
        note: 'Mint age unavailable: oldest signature has no blockTime.',
        reason: RPC_REASON,
      };
    }

    // Full page = older history may still exist. Do not claim an exact age.
    if (sigs.length === 1000) {
      return {
        ageHours: null,
        note: 'Mint age unavailable: mint has a long history (RPC page full). Exact first tx needs deeper pagination.',
        reason: LONG_HISTORY_REASON,
      };
    }

    const blockTimeSec = Number(oldest.blockTime);
    if (!Number.isFinite(blockTimeSec)) {
      return {
        ageHours: null,
        note: 'Mint age unavailable: oldest signature has invalid blockTime.',
        reason: RPC_REASON,
      };
    }

    const ageMs = Date.now() - blockTimeSec * 1000;
    const ageHours = Math.max(0, ageMs / (1000 * 60 * 60));

    return {
      ageHours: Number(ageHours.toFixed(1)),
      source: 'solana-rpc:getSignaturesForAddress',
    };
  } catch (error) {
    return {
      ageHours: null,
      note: `Mint age unavailable: ${
        error instanceof Error ? error.message : String(error)
      }`,
      reason: RPC_REASON,
    };
  }
}
