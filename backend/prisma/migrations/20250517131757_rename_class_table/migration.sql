/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_localId_fkey";

-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "Classes" (
    "classId" SERIAL NOT NULL,
    "ClassName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dateCreate" TIMESTAMP(3),
    "dateModif" TIMESTAMP(3),
    "localId" INTEGER NOT NULL,
    "okBlock" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("classId")
);

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("localId") ON DELETE RESTRICT ON UPDATE CASCADE;
