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
    const chain = dto.chain ?? 'ethereum';
    // Stub path: one provider feeds sample signals for every selected chain.
    const { input, sources } = await this.solanaProvider.fetchScoreInput(
      dto.address,
    );
    const scored = computeRiskScore(input);

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
      freshnessNote:
        'This report currently uses sample signal data for local development. Live source timestamps will appear here once on-chain providers are connected.',
      disclaimer: DISCLAIMER,
    };
  }
}
