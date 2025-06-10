/*
  Warnings:

  - You are about to drop the column `Amount` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "Amount",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
