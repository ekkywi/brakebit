-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('solana');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "address" TEXT NOT NULL,
    "chain" "Chain" NOT NULL DEFAULT 'solana',
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reasons" JSONB NOT NULL,
    "signals" JSONB NOT NULL,
    "sources" JSONB NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CheckHistory_address_chain_idx" ON "CheckHistory"("address", "chain");

-- CreateIndex
CREATE INDEX "CheckHistory_userId_createdAt_idx" ON "CheckHistory"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "CheckHistory" ADD CONSTRAINT "CheckHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
