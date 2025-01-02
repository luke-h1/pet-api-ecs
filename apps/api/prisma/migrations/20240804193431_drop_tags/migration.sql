/*
  Warnings:

  - You are about to drop the `_PetToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PetToTag" DROP CONSTRAINT "_PetToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PetToTag" DROP CONSTRAINT "_PetToTag_B_fkey";

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "_PetToTag";

-- DropTable
DROP TABLE "tags";
