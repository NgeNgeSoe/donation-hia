/*
  Warnings:

  - Changed the type of `payType` on the `Income` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Income" DROP COLUMN "payType",
ADD COLUMN     "payType" "PayType" NOT NULL;

-- CreateIndex
CREATE INDEX "OrganizationPerson_personId_idx" ON "OrganizationPerson"("personId");
