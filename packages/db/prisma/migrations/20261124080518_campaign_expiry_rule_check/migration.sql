-- Enforce exactly one expiry rule per promo campaign and positive day counts / credit amounts
ALTER TABLE "Campaign"
ADD CONSTRAINT "Campaign_single_expiry_rule_chk"
CHECK (
  NUM_NONNULLS("expiresInDays", "fixedExpiresAt") = 1
  AND ("expiresInDays" IS NULL OR "expiresInDays" > 0)
  AND "credits" > 0
);
