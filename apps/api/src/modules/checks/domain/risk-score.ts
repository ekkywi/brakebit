import type { RiskLevel, RiskReason, RiskSignal } from '@brakebit/shared';

export type ScoreInput = {
  mintAuthorityActive: boolean | null;
  freezeAuthorityActive: boolean | null;
  lpLockedOrBurned: boolean | null;
  topHolderPct: number | null;
  liquidityUsd: number | null;
  ageHours: number | null;
};

export type ScoreResult = {
  score: number;
  level: RiskLevel;
  summary: string;
  reasons: RiskReason[];
  signals: RiskSignal[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'low';
  if (score >= 55) return 'medium';
  if (score >= 30) return 'high';
  return 'critical';
}

/**
 * Pure scoring rules. No Nest/Prisma/RPC imports.
 * Stub-friendly: unknown signals don't invent false confidence.
 */
export function computeRiskScore(input: ScoreInput): ScoreResult {
  let score = 70;
  const reasons: RiskReason[] = [];
  const signals: RiskSignal[] = [];

  if (input.mintAuthorityActive === true) {
    score -= 25;
    reasons.push({
      code: 'MINT_AUTHORITY_ACTIVE',
      severity: 'high',
      title: 'Mint authority is active',
      detail:
        'New tokens can still be minted, which can dilute holders. Prefer revoked mint authority when possible.',
    });
    signals.push({
      key: 'mint_authority',
      label: 'Mint authority',
      value: 'active',
      status: 'bad',
    });
  } else if (input.mintAuthorityActive === false) {
    signals.push({
      key: 'mint_authority',
      label: 'Mint authority',
      value: 'revoked',
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'mint_authority',
      label: 'Mint authority',
      value: null,
      status: 'unknown',
    });
  }

  if (input.freezeAuthorityActive === true) {
    score -= 20;
    reasons.push({
      code: 'FREEZE_AUTHORITY_ACTIVE',
      severity: 'high',
      title: 'Freeze authority is active',
      detail:
        'Accounts can be frozen by the authority, which is a meaningful custody/risk concern for holders.',
    });
    signals.push({
      key: 'freeze_authority',
      label: 'Freeze authority',
      value: 'active',
      status: 'bad',
    });
  } else if (input.freezeAuthorityActive === false) {
    signals.push({
      key: 'freeze_authority',
      label: 'Freeze authority',
      value: 'revoked',
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'freeze_authority',
      label: 'Freeze authority',
      value: null,
      status: 'unknown',
    });
  }

  if (input.lpLockedOrBurned === false) {
    score -= 20;
    reasons.push({
      code: 'LP_NOT_LOCKED',
      severity: 'high',
      title: 'LP does not appear locked/burned',
      detail:
        'Unlocked liquidity can be removed quickly. Treat this as a rug-risk signal, not proof of intent.',
    });
    signals.push({
      key: 'lp_lock',
      label: 'LP lock/burn',
      value: 'unlocked/unknown',
      status: 'bad',
    });
  } else if (input.lpLockedOrBurned === true) {
    signals.push({
      key: 'lp_lock',
      label: 'LP lock/burn',
      value: 'locked/burned',
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'lp_lock',
      label: 'LP lock/burn',
      value: null,
      status: 'unknown',
    });
  }

  if (input.topHolderPct != null && input.topHolderPct >= 40) {
    score -= 15;
    reasons.push({
      code: 'HOLDER_CONCENTRATION',
      severity: 'medium',
      title: 'Top holder concentration is high',
      detail: `Top wallet holds about ${input.topHolderPct.toFixed(1)}% of supply. Concentration increases dump risk.`,
    });
    signals.push({
      key: 'top_holder_pct',
      label: 'Top holder %',
      value: Number(input.topHolderPct.toFixed(2)),
      status: 'warn',
    });
  } else if (input.topHolderPct != null) {
    signals.push({
      key: 'top_holder_pct',
      label: 'Top holder %',
      value: Number(input.topHolderPct.toFixed(2)),
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'top_holder_pct',
      label: 'Top holder %',
      value: null,
      status: 'unknown',
    });
  }

  if (input.liquidityUsd != null && input.liquidityUsd < 10_000) {
    score -= 10;
    reasons.push({
      code: 'LOW_LIQUIDITY',
      severity: 'medium',
      title: 'Liquidity looks thin',
      detail: `Reported liquidity is about $${Math.round(input.liquidityUsd).toLocaleString()}. Thin books amplify slippage and manipulation risk.`,
    });
    signals.push({
      key: 'liquidity_usd',
      label: 'Liquidity (USD)',
      value: Math.round(input.liquidityUsd),
      status: 'warn',
    });
  } else if (input.liquidityUsd != null) {
    signals.push({
      key: 'liquidity_usd',
      label: 'Liquidity (USD)',
      value: Math.round(input.liquidityUsd),
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'liquidity_usd',
      label: 'Liquidity (USD)',
      value: null,
      status: 'unknown',
    });
  }

  if (input.ageHours != null && input.ageHours < 24) {
    score -= 10;
    reasons.push({
      code: 'VERY_NEW_TOKEN',
      severity: 'medium',
      title: 'Token is very new',
      detail: `Estimated age is under ${Math.max(1, Math.round(input.ageHours))} hour(s). Newer tokens have less observable history.`,
    });
    signals.push({
      key: 'age_hours',
      label: 'Age (hours)',
      value: Number(input.ageHours.toFixed(1)),
      status: 'warn',
    });
  } else if (input.ageHours != null) {
    signals.push({
      key: 'age_hours',
      label: 'Age (hours)',
      value: Number(input.ageHours.toFixed(1)),
      status: 'ok',
    });
  } else {
    signals.push({
      key: 'age_hours',
      label: 'Age (hours)',
      value: null,
      status: 'unknown',
    });
  }

  const finalScore = clampScore(score);
  const level = levelFromScore(finalScore);

  if (reasons.length === 0) {
    reasons.push({
      code: 'LIMITED_DATA',
      severity: 'unknown',
      title: 'Limited on-chain signals available',
      detail:
        'Available data is incomplete. Treat this score as directional only, not a safety assurance.',
    });
  }

  const summary =
    level === 'low'
      ? 'Fewer elevated findings in the signals reviewed. Independent verification is still recommended.'
      : level === 'medium'
        ? 'Some findings warrant attention. Review the details before making a decision.'
        : level === 'high'
          ? 'Several elevated findings were identified. Review the details carefully before proceeding.'
          : 'Critical findings were identified, or available data is too limited for a confident reading.';

  return {
    score: finalScore,
    level,
    summary,
    reasons,
    signals,
  };
}
