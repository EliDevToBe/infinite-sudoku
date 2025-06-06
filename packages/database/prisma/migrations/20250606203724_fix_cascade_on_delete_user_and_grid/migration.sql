-- DropForeignKey
ALTER TABLE "user_grid" DROP CONSTRAINT "user_grid_grid_id_foreign";

-- DropForeignKey
ALTER TABLE "user_grid" DROP CONSTRAINT "user_grid_user_id_foreign";

-- AddForeignKey
ALTER TABLE "user_grid" ADD CONSTRAINT "user_grid_grid_id_foreign" FOREIGN KEY ("grid_id") REFERENCES "grid"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_grid" ADD CONSTRAINT "user_grid_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
