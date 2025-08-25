-- AlterTable
ALTER TABLE "public"."grid" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "public"."user_grid" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
