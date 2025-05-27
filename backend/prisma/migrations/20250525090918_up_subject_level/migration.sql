/*
  Warnings:

  - Added the required column `level` to the `subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "level" INTEGER NOT NULL;
