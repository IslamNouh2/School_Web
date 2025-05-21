import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStudentDto } from './dto/CreateStudentDto';
import { UpdateStudentDto } from './dto/UpdateStudentDto';
import { last } from 'rxjs';

@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) { }

    async GetCountStudent() {
        const total = await this.prisma.student.count();
        const boys = await this.prisma.student.count({ where: { gender: 'Male' } });
        const girls = await this.prisma.student.count({ where: { gender: 'Female' } });
        return { total, boys, girls };
    }

    async CreateStudent(dto: CreateStudentDto, photo: Buffer | null) {

        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            address,

            parentId,
            fatherName,
            fatherNumber,
            matherName,
            matherNumber,
            matherJob,
            fatherJob,


            code,
            health,
            dateCreate,
            dateModif,
            lieuOfBirth,
            bloodType,
            etatCivil,
            cid,
            nationality,
            observation,
            numNumerisation,
            dateInscription,
            okBlock,
        } = dto;

        let finalParentId = parentId;

        if (fatherName && fatherNumber || matherName || matherNumber) {
            const Parent = await this.prisma.parent.create({
                data: {
                    father: fatherName || '',
                    mother: matherName || '',
                    fatherJob: fatherJob || '',
                    motherJob: matherJob || '',
                    motherNumber: matherNumber || '',
                    fatherNumber: fatherNumber || '',
                },
                select: {
                    parentId: true,
                },
            });

            finalParentId = Parent.parentId;
        }

        if (!finalParentId) {
            finalParentId = 1;
        }

        console.log(finalParentId);

        const student = await this.prisma.student.create({
            data: {
                firstName,
                lastName,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                address,
                parentId: finalParentId,
                code,
                health,
                dateCreate: dateCreate ? new Date(dateCreate) : undefined,
                dateModif: dateModif ? new Date(dateModif) : undefined,
                lieuOfBirth,
                bloodType,
                etatCivil,
                cid,
                nationality,
                observation,
                numNumerisation,
                dateInscription: new Date(dateInscription),
                okBlock,
                photo: photo ?? undefined, // <--- Add this
            },
        });

        return student;
    }


    async UpdateStudent(studentId: number, dto: UpdateStudentDto) {

        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            address,
            parentId,
            fatherName,
            fatherNumber,
            matherName,
            matherNumber,
            matherJob,
            fatherJob,
            code,
            health,
            dateCreate,
            dateModif,
            lieuOfBirth,
            bloodType,
            etatCivil,
            cid,
            nationality,
            observation,
            numNumerisation,
            dateInscription,
            photo,
            okBlock,
        } = dto;

        let finalParentId = parentId;

        if (fatherName || fatherNumber || matherName || matherNumber) {
            if (parentId) {
                // Update existing parent
                await this.prisma.parent.update({
                    where: { parentId },
                    data: {
                        father: fatherName || undefined,
                        mother: matherName || undefined,
                        fatherJob: fatherJob || undefined,
                        motherJob: matherJob || undefined,
                        fatherNumber: fatherNumber || undefined,
                        motherNumber: matherNumber || undefined,
                    },
                });
                finalParentId = parentId;
            } else {
                // Create new parent
                const parent = await this.prisma.parent.create({
                    data: {
                        father: fatherName || '',
                        mother: matherName || '',
                        fatherJob: fatherJob || '',
                        motherJob: matherJob || '',
                        fatherNumber: fatherNumber || '',
                        motherNumber: matherNumber || '',
                    },
                });
                finalParentId = parent.parentId;
            }
        }

        const updatedStudent = await this.prisma.student.update({
            where: { studentId },
            data: {
                firstName,
                lastName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender,
                address,
                parentId: finalParentId,
                code,
                health,
                dateCreate: dateCreate ? new Date(dateCreate) : undefined,
                dateModif: dateModif ? new Date(dateModif) : undefined,
                lieuOfBirth,
                bloodType,
                etatCivil,
                cid,
                nationality,
                observation,
                numNumerisation,
                dateInscription: dateInscription ? new Date(dateInscription) : undefined,
                photo,
                okBlock,
            },
        });

        return updatedStudent;
    }


    async DeleteStudent(Id: number) {
        const student = await this.prisma.student.findUnique({ where: { studentId: Id } });

        if (!student) {
            throw new NotFoundException('STUDENT NOT FOUND');
        }

        await this.prisma.student.delete({ where: { studentId: Id } });
    }


    async GetStudent(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [students, total] = await this.prisma.$transaction([
            this.prisma.student.findMany({
                skip,
                take: limit,
            }),
            this.prisma.student.count(),
        ]);

        return {
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async GetStudentWithName(name: string, page: number, limit: number) {
        return this.prisma.student.findMany({
            where: {
                lastName: {
                    contains: name,  // case-insensitive search
                    mode: 'insensitive'
                }
            },
            skip: (page - 1) * limit,  // pagination
            take: limit,  // limit results
        });
    }
}
