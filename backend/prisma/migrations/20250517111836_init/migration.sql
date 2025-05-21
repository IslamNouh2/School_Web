-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" "RoleType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "parentId" SERIAL NOT NULL,
    "father" TEXT,
    "mother" TEXT,
    "fatherJob" TEXT,
    "motherJob" TEXT,
    "motherNumber" TEXT,
    "fatherNumber" TEXT,
    "kafil" INTEGER NOT NULL DEFAULT 0,
    "fatherCid" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("parentId")
);

-- CreateTable
CREATE TABLE "Student" (
    "studentId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "code" TEXT,
    "health" TEXT,
    "dateCreate" TIMESTAMP(3),
    "dateModif" TIMESTAMP(3),
    "lieuOfBirth" TEXT,
    "bloodType" TEXT,
    "etatCivil" TEXT,
    "cid" TEXT,
    "nationality" TEXT,
    "observation" TEXT,
    "numNumerisation" TEXT NOT NULL DEFAULT '0',
    "dateInscription" TIMESTAMP(3) NOT NULL,
    "photo" BYTEA,
    "okBlock" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "Local" (
    "localId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dateCreate" TIMESTAMP(3),
    "dateModif" TIMESTAMP(3),
    "NumClass" INTEGER,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("localId")
);

-- CreateTable
CREATE TABLE "Class" (
    "classId" SERIAL NOT NULL,
    "ClassName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dateCreate" TIMESTAMP(3),
    "dateModif" TIMESTAMP(3),
    "localId" INTEGER NOT NULL,
    "okBlock" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("localId") ON DELETE RESTRICT ON UPDATE CASCADE;
