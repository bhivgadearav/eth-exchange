-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Txn" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "Txn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "chainId" INTEGER,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainDetails" (
    "id" SERIAL NOT NULL,
    "mnemonic" TEXT[],

    CONSTRAINT "ChainDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "mainWalletId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_chainId_key" ON "User"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mainWalletId_key" ON "User"("mainWalletId");

-- AddForeignKey
ALTER TABLE "Txn" ADD CONSTRAINT "Txn_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "ChainDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "ChainDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mainWalletId_fkey" FOREIGN KEY ("mainWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
