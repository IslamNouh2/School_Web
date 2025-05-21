import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.subject.upsert({
        where: { subjectId: -1 },
        update: {},
        create: {
            subjectId: -1,
            subjectName: 'subject',
            totalGrads: 0,
            parentId: -1,
            BG: 0,
            BD: 1,
        },
    });

    await prisma.parameter.upsert({
        where: { paramId: 1 },
        update: {},
        create: {
            paramId: 1,
            paramName: 'Ok_Sub_subject',
            okActive : true
        },
    });

    console.log('Default root subject inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });