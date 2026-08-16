/*
  Warnings:

  - A unique constraint covering the columns `[directChatKey]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "directChatKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_directChatKey_key" ON "Conversation"("directChatKey");
