/*
  Warnings:

  - A unique constraint covering the columns `[user_id,grid_id]` on the table `user_grid` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_grid_user_id_grid_id_key" ON "user_grid"("user_id", "grid_id");
