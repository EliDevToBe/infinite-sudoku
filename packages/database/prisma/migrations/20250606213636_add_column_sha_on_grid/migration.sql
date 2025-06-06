/*
  Warnings:

  - A unique constraint covering the columns `[sha256]` on the table `grid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sha256` to the `grid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "grid" ADD COLUMN     "sha256" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "grid_sha256_key" ON "grid"("sha256");
