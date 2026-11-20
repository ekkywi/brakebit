import { Injectable } from '@nestjs/common';
import type { RiskReport } from '@brakebit/shared';
import { CreateCheckDto } from './dto/create-check.dto';
import { computeRiskScore } from './domain/risk-score';
import { SolanaTokenProvider } from './providers/solana.provider';

const DISCLAIMER =
  'Brakebit provides risk indicators for informational purposes only. This is not investment advice, and a score is not an assurance of safety or performance.';

@Injectable()
export class ChecksService {
  private readonly solanaProvider = new SolanaTokenProvider();

  async createCheck(dto: CreateCheckDto): Promise<RiskReport> {
    const chain = dto.chain ?? 'solana';

    const { input, sources, notes, token } =
      await this.solanaProvider.fetchScoreInput(dto.address);
    const scored = computeRiskScore(input);

    const baseFreshness =
      'Mint authority, freeze authority, top-holder share, mint age (when history is short enough), and display metadata are read from Solana RPC / DAS when available. Liquidity and LP lock are not measured yet.';
    const freshnessNote =
      notes.length > 0 ? `${baseFreshness} ${notes.join(' ')}` : baseFreshness;

    return {
      address: dto.address,
      chain,
      score: scored.score,
      level: scored.level,
      summary: scored.summary,
      reasons: scored.reasons,
      signals: scored.signals,
      sources,
      checkedAt: new Date().toISOString(),
      freshnessNote,
      disclaimer: DISCLAIMER,
      token: {
        name: token.name,
        symbol: token.symbol,
        imageUrl: token.imageUrl,
      },
    };
  }
}
