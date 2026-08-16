-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "deletedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
