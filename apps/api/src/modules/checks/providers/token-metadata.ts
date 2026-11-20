export type TokenMetadataLookup = {
  name: string | null;
  symbol: string | null;
  imageUrl: string | null;
  source?: string;
  note?: string;
};

function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanUrl(value: unknown): string | null {
  const text = cleanText(value);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Read display metadata via Helius DAS getAsset on the same RPC URL.
 * Non-Helius RPCs may reject the method; then fields stay null (honest).
 */
export async function fetchTokenMetadata(
  rpcUrl: string,
  mint: string,
): Promise<TokenMetadataLookup> {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'brakebit-token-meta',
        method: 'getAsset',
        params: { id: mint },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return {
        name: null,
        symbol: null,
        imageUrl: null,
        note: `Token metadata unavailable: RPC HTTP ${res.status}.`,
      };
    }

    const body = (await res.json()) as {
      error?: { message?: string };
      result?: {
        content?: {
          metadata?: { name?: string; symbol?: string };
          links?: { image?: string };
          files?: Array<{ uri?: string; cdn_uri?: string }>;
        };
      };
    };

    if (body.error) {
      return {
        name: null,
        symbol: null,
        imageUrl: null,
        note: `Token metadata unavailable: ${body.error.message ?? 'getAsset failed'}.`,
      };
    }

    const content = body.result?.content;
    const name = cleanText(content?.metadata?.name);
    const symbol = cleanText(content?.metadata?.symbol);
    const imageUrl =
      cleanUrl(content?.links?.image) ??
      cleanUrl(content?.files?.[0]?.cdn_uri) ??
      cleanUrl(content?.files?.[0]?.uri);

    if (!name && !symbol && !imageUrl) {
      return {
        name: null,
        symbol: null,
        imageUrl: null,
        note: 'Token metadata unavailable: no name/symbol/image on this mint.',
      };
    }

    return {
      name,
      symbol,
      imageUrl,
      source: 'helius-das:getAsset',
    };
  } catch (error) {
    return {
      name: null,
      symbol: null,
      imageUrl: null,
      note: `Token metadata unavailable: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
