-- AlterTable
ALTER TABLE "GeneralData" ADD COLUMN     "domain_email" TEXT DEFAULT '',
ADD COLUMN     "sender_email" TEXT DEFAULT '',
ADD COLUMN     "token_email" TEXT DEFAULT '';
