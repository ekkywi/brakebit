export type TopHolderLookup = {
  pct: number | null;
  source?: string;
  note?: string;
};

function clampPct(value: number): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.min(100, Number(value.toFixed(2)));
}

/** Rugcheck public report — works for many retail mints; mega-caps often empty. */
export async function fetchTopHolderFromRugcheck(
  mint: string,
): Promise<TopHolderLookup> {
  try {
    const res = await fetch(
      `https://api.rugcheck.xyz/v1/tokens/${mint}/report`,
      {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (!res.ok) {
      return {
        pct: null,
        note: `Top-holder fallback (rugcheck) HTTP ${res.status}.`,
      };
    }

    const data = (await res.json()) as {
      topHolders?: Array<{ pct?: number; amount?: number }>;
    };
    const top = data.topHolders?.[0];
    if (!top || typeof top.pct !== 'number') {
      return {
        pct: null,
        note: 'Top-holder fallback (rugcheck) has no holder index for this mint.',
      };
    }

    const pct = clampPct(top.pct);
    if (pct == null) {
      return { pct: null, note: 'Top-holder fallback (rugcheck) returned invalid pct.' };
    }

    return { pct, source: 'rugcheck.xyz:topHolders' };
  } catch (error) {
    return {
      pct: null,
      note: `Top-holder fallback (rugcheck) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * Optional Solscan Pro holders API.
 * Set SOLSCAN_API_KEY from https://pro-api.solscan.io (covers more mega-caps).
 */
export async function fetchTopHolderFromSolscan(
  mint: string,
): Promise<TopHolderLookup> {
  const apiKey = process.env.SOLSCAN_API_KEY?.trim();
  if (!apiKey) {
    return { pct: null };
  }

  try {
    const url = new URL('https://pro-api.solscan.io/v2.0/token/holders');
    url.searchParams.set('address', mint);
    url.searchParams.set('page', '1');
    url.searchParams.set('page_size', '10');

    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        token: apiKey,
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      return {
        pct: null,
        note: `Top-holder fallback (solscan) HTTP ${res.status}.`,
      };
    }

    const data = (await res.json()) as {
      data?: { items?: Array<{ percentage?: number; amount?: string }> };
    };
    const top = data.data?.items?.[0];
    if (!top || typeof top.percentage !== 'number') {
      return {
        pct: null,
        note: 'Top-holder fallback (solscan) returned no holders.',
      };
    }

    const pct = clampPct(top.percentage);
    if (pct == null) {
      return { pct: null, note: 'Top-holder fallback (solscan) returned invalid pct.' };
    }

    return { pct, source: 'solscan:token/holders' };
  } catch (error) {
    return {
      pct: null,
      note: `Top-holder fallback (solscan) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * Optional Birdeye holder list.
 * Set BIRDEYE_API_KEY from https://birdeye.so (free tier covers many mega-caps).
 */
export async function fetchTopHolderFromBirdeye(
  mint: string,
): Promise<TopHolderLookup> {
  const apiKey = process.env.BIRDEYE_API_KEY?.trim();
  if (!apiKey) {
    return { pct: null };
  }

  try {
    const url = new URL('https://public-api.birdeye.so/defi/v3/token/holder');
    url.searchParams.set('address', mint);
    url.searchParams.set('offset', '0');
    url.searchParams.set('limit', '1');

    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        'x-chain': 'solana',
        'X-API-KEY': apiKey,
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      return {
        pct: null,
        note: `Top-holder fallback (birdeye) HTTP ${res.status}.`,
      };
    }

    const data = (await res.json()) as {
      success?: boolean;
      data?: {
        items?: Array<{ percentage?: number; ui_amount?: number }>;
      };
    };
    const top = data.data?.items?.[0];
    if (!top || typeof top.percentage !== 'number') {
      return {
        pct: null,
        note: 'Top-holder fallback (birdeye) returned no holders.',
      };
    }

    // Birdeye percentage is often 0–1 fraction; accept either scale.
    const raw = top.percentage <= 1 ? top.percentage * 100 : top.percentage;
    const pct = clampPct(raw);
    if (pct == null) {
      return {
        pct: null,
        note: 'Top-holder fallback (birdeye) returned invalid pct.',
      };
    }

    return { pct, source: 'birdeye:token/holder' };
  } catch (error) {
    return {
      pct: null,
      note: `Top-holder fallback (birdeye) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
