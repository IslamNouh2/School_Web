/*
  Warnings:

  - A unique constraint covering the columns `[paramName]` on the table `parameter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parameter_paramName_key" ON "parameter"("paramName");
