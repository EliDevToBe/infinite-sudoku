CREATE TABLE public.grid (
  "id" UUID NOT NULL,
  "puzzle" jsonb NOT NULL,
  "solution" jsonb NOT NULL,
  "difficulty" SMALLINT NOT NULL,
  "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE public.grid ADD PRIMARY KEY ("id");

CREATE TABLE public.user (
  "id" UUID NOT NULL,
  "pseudo" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "avatar" TEXT NULL,
  "role" VARCHAR(255) CHECK ("role" IN ('member', 'admin')) NOT NULL DEFAULT 'member',
  "quality" VARCHAR(255) CHECK ("quality" IN ('basic', 'premium')) NOT NULL DEFAULT 'basic',
  "has_confirmed_email" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE public.user ADD PRIMARY KEY ("id");

ALTER TABLE public.user ADD CONSTRAINT "user_email_unique" UNIQUE ("email");

CREATE TABLE public.user_grid (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "grid_id" UUID NOT NULL,
  "backup_wip" jsonb NULL,
  "started_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "finished_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
  "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
  "score" INTEGER NOT NULL,
  "highest_score" INTEGER NOT NULL,
  "try_number" INTEGER NULL
);

ALTER TABLE public.user_grid ADD PRIMARY KEY ("id");

ALTER TABLE public.user_grid ADD CONSTRAINT "user_grid_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES public.user ("id");

ALTER TABLE public.user_grid ADD CONSTRAINT "user_grid_grid_id_foreign" FOREIGN KEY ("grid_id") REFERENCES public.grid ("id");