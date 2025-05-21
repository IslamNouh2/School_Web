import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { prismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';
import { LocalModule } from './local/local.module';
import { ClassModule } from './class/class.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [AuthModule, prismaModule, UsersModule, StudentModule, LocalModule, ClassModule, SubjectsModule]
})
export class AppModule {}
