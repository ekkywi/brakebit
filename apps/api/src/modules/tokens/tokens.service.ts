import { Injectable } from '@nestjs/common';

export type TokenSearchHit = {
  mint: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
};

type JupiterSearchItem = {
  id?: string;
  name?: string;
  symbol?: string;
  icon?: string;
};

@Injectable()
export class TokensService {
  async search(query: string): Promise<TokenSearchHit[]> {
    const q = query.trim();
    if (q.length < 2) return [];

    const url = new URL('https://lite-api.jup.ag/tokens/v2/search');
    url.searchParams.set('query', q);

    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      throw new Error(`Token search failed (HTTP ${res.status})`);
    }

    const data = (await res.json()) as JupiterSearchItem[];
    if (!Array.isArray(data)) return [];

    const hits: TokenSearchHit[] = [];
    for (const item of data) {
      const mint = typeof item.id === 'string' ? item.id.trim() : '';
      if (mint.length < 32) continue;

      hits.push({
        mint,
        name: (item.name ?? 'Unknown').trim() || 'Unknown',
        symbol: (item.symbol ?? '???').trim() || '???',
        imageUrl:
          typeof item.icon === 'string' && item.icon.startsWith('http')
            ? item.icon
            : null,
      });

      if (hits.length >= 8) break;
    }

    return hits;
  }
}
