-- AlterTable
ALTER TABLE "Accounts" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "date" DROP NOT NULL;
