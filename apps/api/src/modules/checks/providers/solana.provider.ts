import { Connection, PublicKey } from '@solana/web3.js';
import {
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { fetchMintAgeHours } from './mint-age';
import type { ScoreInput } from '../domain/risk-score';
import { topHolderPercent } from './top-holder';
import {
  fetchTokenMetadata,
  type TokenMetadataLookup,
} from './token-metadata';
import {
  fetchTopHolderFromBirdeye,
  fetchTopHolderFromRugcheck,
  fetchTopHolderFromSolscan,
  type TopHolderLookup,
} from './top-holder-sources';
import { fetchMarketLiquidityUsd } from './market-liquidity';
import { fetchLpLockFromRugcheck } from './lp-lock';

function resolveTokenProgram(owner: PublicKey) {
  if (owner.equals(TOKEN_2022_PROGRAM_ID)) return TOKEN_2022_PROGRAM_ID;
  if (owner.equals(TOKEN_PROGRAM_ID)) return TOKEN_PROGRAM_ID;
  return null;
}

export type SolanaProviderResult = {
  input: ScoreInput;
  sources: string[];
  notes: string[];
  token: TokenMetadataLookup;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isRetryableRpcError(error: unknown): boolean {
  const text = errorText(error);
  return /429|too many requests|rate.?limit/i.test(text);
}

/** Helius (and some RPCs) reject getTokenLargestAccounts on mega-cap mints. */
function isMegaMintRpcError(error: unknown): boolean {
  const text = errorText(error);
  return /too many accounts requested|try adding filters/i.test(text);
}

async function withRetries<T>(
  label: string,
  run: () => Promise<T>,
  attempts = 2,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isRetryableRpcError(error) || attempt === attempts) {
        throw error;
      }
      await sleep(400 * 2 ** (attempt - 1));
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`${label} failed after retries`);
}

async function fetchTopHolderFromRpc(
  connection: Connection,
  mintPubkey: PublicKey,
  supply: bigint,
): Promise<TopHolderLookup> {
  try {
    const largest = await withRetries('getTokenLargestAccounts', () =>
      connection.getTokenLargestAccounts(mintPubkey),
    );
    const top = largest.value[0];
    if (!top) {
      return {
        pct: null,
        note: 'RPC getTokenLargestAccounts returned no accounts.',
      };
    }

    const pct = topHolderPercent(top.amount, supply);
    if (pct == null) {
      return { pct: null, note: 'Mint supply is zero; cannot compute top holder %.' };
    }

    return { pct, source: 'solana-rpc:getTokenLargestAccounts' };
  } catch (error) {
    if (isMegaMintRpcError(error)) {
      return {
        pct: null,
        note: 'RPC cannot index getTokenLargestAccounts for this mega-cap mint.',
      };
    }
    if (isRetryableRpcError(error)) {
      return {
        pct: null,
        note: 'RPC rate-limited getTokenLargestAccounts.',
      };
    }
    return {
      pct: null,
      note: `RPC getTokenLargestAccounts failed: ${errorText(error)}`,
    };
  }
}

/**
 * Resolve top-holder % with fallbacks:
 * 1) Solana RPC getTokenLargestAccounts (most retail / mid-size mints)
 * 2) Rugcheck public report when available
 * 3) Solscan Pro when SOLSCAN_API_KEY is set
 * 4) Birdeye when BIRDEYE_API_KEY is set (mega-caps like USDC)
 */
async function resolveTopHolderPct(
  connection: Connection,
  mintAddress: string,
  mintPubkey: PublicKey,
  supply: bigint,
): Promise<TopHolderLookup> {
  const rpcResult = await fetchTopHolderFromRpc(
    connection,
    mintPubkey,
    supply,
  );
  if (rpcResult.pct != null) return rpcResult;

  const rugcheck = await fetchTopHolderFromRugcheck(mintAddress);
  if (rugcheck.pct != null) return rugcheck;

  const solscan = await fetchTopHolderFromSolscan(mintAddress);
  if (solscan.pct != null) return solscan;

  const birdeye = await fetchTopHolderFromBirdeye(mintAddress);
  if (birdeye.pct != null) return birdeye;

  const triedIndexerKeys =
    Boolean(process.env.SOLSCAN_API_KEY?.trim()) ||
    Boolean(process.env.BIRDEYE_API_KEY?.trim());

  if (rpcResult.note?.includes('mega-cap') && !triedIndexerKeys) {
    return {
      pct: null,
      note: `${rpcResult.note} Add SOLSCAN_API_KEY or BIRDEYE_API_KEY for mega-cap holder coverage.`,
    };
  }

  const notes = [
    rpcResult.note,
    rugcheck.note,
    solscan.note,
    birdeye.note,
  ].filter((value): value is string => Boolean(value));

  return {
    pct: null,
    note:
      notes.join(' ') ||
      'Top-holder share unavailable from RPC and holder indexers for this mint.',
  };
}

/**
 * Live Solana mint reader.
 * Supports SPL Token and Token-2022. Authority from getMint; top holder + age from RPC.
 */
export class SolanaTokenProvider {
  async fetchScoreInput(address: string): Promise<SolanaProviderResult> {
    const rpcUrl = process.env.SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error('SOLANA_RPC_URL is not set');
    }

    let mintPubkey: PublicKey;
    try {
      mintPubkey = new PublicKey(address);
    } catch {
      throw new Error('Invalid Solana mint address');
    }

    const connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
    });

    const accountInfo = await withRetries('getAccountInfo', () =>
      connection.getAccountInfo(mintPubkey),
    );
    if (!accountInfo) {
      throw new Error(
        'No account at this address on Solana. Check that you pasted a live mint.',
      );
    }

    const tokenProgram = resolveTokenProgram(accountInfo.owner);
    if (!tokenProgram) {
      throw new Error(
        'This address is not an SPL Token or Token-2022 mint.',
      );
    }

    let mint;
    try {
      mint = await withRetries('getMint', () =>
        getMint(connection, mintPubkey, 'confirmed', tokenProgram),
      );
    } catch {
      throw new Error(
        'Could not read this mint on Solana. Check the address and RPC.',
      );
    }

    const mintAuthorityActive = mint.mintAuthority !== null;
    const freezeAuthorityActive = mint.freezeAuthority !== null;

    await sleep(100);

    const [holders, token, market, lp] = await Promise.all([
      resolveTopHolderPct(connection, address, mintPubkey, mint.supply),
      fetchTokenMetadata(rpcUrl, address),
      fetchMarketLiquidityUsd(address),
      fetchLpLockFromRugcheck(address),
    ]);

    await sleep(100);

    const age = await fetchMintAgeHours(connection, mintPubkey);

    const notes: string[] = [];
    if (holders.note) notes.push(holders.note);
    if (token.note) notes.push(token.note);
    if (age.note) notes.push(age.note);
    if (market.note) notes.push(market.note);
    if (lp.note) notes.push(lp.note);

    const input: ScoreInput = {
      mintAuthorityActive,
      freezeAuthorityActive,
      lpLockedOrBurned: lp.locked,
      topHolderPct: holders.pct,
      liquidityUsd: market.liquidityUsd,
      ageHours: age.ageHours,
    };

    let rpcHost = 'solana-rpc';
    try {
      rpcHost = new URL(rpcUrl).host;
    } catch {
      // keep default label
    }

    const sources = [`solana-rpc:${rpcHost}`];
    if (holders.source) sources.push(holders.source);
    if (token.source) sources.push(token.source);
    if (age.source) sources.push(age.source);
    if (market.source) sources.push(market.source);
    if (lp.source) sources.push(lp.source);

    return { input, sources, notes, token };
  }
}
