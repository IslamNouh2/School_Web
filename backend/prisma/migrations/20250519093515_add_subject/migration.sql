-- CreateTable
CREATE TABLE "subject" (
    "subjectId" SERIAL NOT NULL,
    "subjectName" TEXT NOT NULL,
    "totalGrads" DOUBLE PRECISION NOT NULL,
    "parentId" INTEGER NOT NULL,
    "BG" INTEGER NOT NULL,
    "BD" INTEGER NOT NULL,
    "okBlock" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subjectId")
);

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "subject"("subjectId") ON DELETE RESTRICT ON UPDATE CASCADE;
