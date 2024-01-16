-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "hos_usr_usuario" (
    "usr_code" TEXT NOT NULL,
    "usr_code_employe" TEXT NOT NULL,
    "usr_names" TEXT NOT NULL,
    "usr_surnames" TEXT NOT NULL,
    "usr_password" TEXT NOT NULL,
    "usr_attempts_faile" SMALLINT NOT NULL DEFAULT 0,
    "usr_status" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "usr_date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_date_update" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_user_create" TEXT NOT NULL,
    "usr_usrer_update" TEXT NOT NULL,

    CONSTRAINT "mar_usr_pk" PRIMARY KEY ("usr_code")
);
