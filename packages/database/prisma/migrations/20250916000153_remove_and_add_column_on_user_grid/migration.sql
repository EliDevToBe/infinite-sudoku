/*
  Warnings:

  - You are about to drop the column `highest_score` on the `user_grid` table. All the data in the column will be lost.
  - You are about to drop the column `try_number` on the `user_grid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user_grid" DROP COLUMN "highest_score",
DROP COLUMN "try_number",
ADD COLUMN     "time" INTEGER;
