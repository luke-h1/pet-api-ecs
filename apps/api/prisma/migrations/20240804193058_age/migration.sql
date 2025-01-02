/*
  Warnings:

  - You are about to drop the column `type` on the `pets` table. All the data in the column will be lost.
  - Added the required column `age` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "type",
ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
