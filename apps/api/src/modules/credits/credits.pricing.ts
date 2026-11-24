export const CREDIT_COSTS = {
    live_check: 1,
} as const;

export type CreditFeature = keyof typeof CREDIT_COSTS;