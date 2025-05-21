/*
  Warnings:

  - You are about to drop the `Classes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_localId_fkey";

-- DropTable
DROP TABLE "Classes";

-- CreateTable
CREATE TABLE "classes" (
    "classId" SERIAL NOT NULL,
    "ClassName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dateCreate" TIMESTAMP(3),
    "dateModif" TIMESTAMP(3),
    "NumStudent" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "okBlock" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "classes_pkey" PRIMARY KEY ("classId")
);

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("localId") ON DELETE RESTRICT ON UPDATE CASCADE;
