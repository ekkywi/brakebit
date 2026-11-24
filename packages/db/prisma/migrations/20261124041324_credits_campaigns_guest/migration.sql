-- CreateEnum
CREATE TYPE "CampaignTrigger" AS ENUM ('first_login', 'code', 'manual');

-- CreateEnum
CREATE TYPE "LotSource" AS ENUM ('promo', 'purchase');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('promo_grant', 'purchase', 'check_spend', 'refund', 'admin_adjust', 'expire');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "trigger" "CampaignTrigger" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "expiresInDays" INTEGER,
    "fixedExpiresAt" TIMESTAMP(3),
    "maxClaims" INTEGER,
    "claimCount" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditLot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "LotSource" NOT NULL,
    "campaignId" TEXT,
    "amount" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "delta" INTEGER NOT NULL,
    "lotId" TEXT,
    "refId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestUsage" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GuestUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_key_key" ON "Campaign"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_code_key" ON "Campaign"("code");

-- CreateIndex
CREATE INDEX "CreditLot_userId_expiresAt_idx" ON "CreditLot"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreditLot_userId_campaignId_key" ON "CreditLot"("userId", "campaignId");

-- CreateIndex
CREATE INDEX "CreditLedger_userId_createdAt_idx" ON "CreditLedger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedger_refId_idx" ON "CreditLedger"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "GuestUsage_ipHash_day_key" ON "GuestUsage"("ipHash", "day");

-- AddForeignKey
ALTER TABLE "CreditLot" ADD CONSTRAINT "CreditLot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLot" ADD CONSTRAINT "CreditLot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed: welcome campaign (10 credits, valid 7 days from claim, granted on first login)
INSERT INTO "Campaign" ("id", "key", "name", "credits", "trigger", "isActive", "expiresInDays", "claimCount", "createdAt", "updatedAt")
VALUES ('campaign_welcome', 'welcome', 'Welcome credits', 10, 'first_login', true, 7, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
