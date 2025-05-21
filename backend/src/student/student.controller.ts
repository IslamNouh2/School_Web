import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateStudentDto } from './dto/CreateStudentDto';
import { UpdateStudentDto } from './dto/UpdateStudentDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Roles('ADMIN')
  @Get('Count')
  async GetCountStudent() {
    const Count = await this.studentService.GetCountStudent();
    return Count;
  }


  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('photo'))
  @Post('create')
  async createStudent(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateStudentDto
  ) {
    return this.studentService.CreateStudent(dto, file?.buffer ?? null);
  }

  @Put(':id')
  async UpdateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    const Student = await this.studentService.UpdateStudent(id, dto);
    return Student;
  }


  @Delete(':id')
  async DeleteStudent(
    @Param('id', ParseIntPipe) id: number
  ) {
    const Delete = await this.studentService.DeleteStudent(id);
    return { message: 'Student deleted successfully' };
  }



  @Roles('ADMIN')
  @Get()
  async getStudents(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('name') name?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (name) {
      return this.studentService.GetStudentWithName(name, pageNumber, limitNumber);
    }

    return this.studentService.GetStudent(pageNumber, limitNumber);
  }



}
