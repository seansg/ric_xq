-- CreateTable
CREATE TABLE "TransactionsType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TransactionsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TradeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" SERIAL NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "shares" INTEGER NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL,
    "tradeType" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);
