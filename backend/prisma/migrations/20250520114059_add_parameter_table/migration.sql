-- CreateTable
CREATE TABLE "parameter" (
    "paramId" SERIAL NOT NULL,
    "paramName" TEXT NOT NULL,
    "okActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "parameter_pkey" PRIMARY KEY ("paramId")
);
