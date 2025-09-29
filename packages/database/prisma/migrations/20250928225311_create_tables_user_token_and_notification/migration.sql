-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('password_reset', 'email_verification');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('password_reset', 'email_verification');

-- CreateEnum
CREATE TYPE "public"."NotificationTransport" AS ENUM ('email');

-- CreateTable
CREATE TABLE "public"."user_token" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "type" "public"."TokenType" NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "transport" "public"."NotificationTransport" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_token_token_key" ON "public"."user_token"("token");

-- CreateIndex
CREATE INDEX "user_token_token_idx" ON "public"."user_token"("token");

-- CreateIndex
CREATE INDEX "user_token_user_id_type_idx" ON "public"."user_token"("user_id", "type");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "public"."notification"("user_id");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email");

-- AddForeignKey
ALTER TABLE "public"."user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
