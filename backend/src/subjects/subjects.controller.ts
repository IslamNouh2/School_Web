import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')

export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @Post('createSub')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }


  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sort') sort: string
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const validSortFields = ['dateCreate', 'code', 'ClassName']
    const orderByField = validSortFields.includes(sort) ? sort : 'subjectName'

    return this.subjectsService.findAll(pageNumber, limitNumber, orderByField);
  }

  @Get('sub')
  async findSubSubjects() {
    const subSubjects = await this.subjectsService.findSubSubjects();
    return subSubjects.map(sub => ({
      SubjectId: sub.subjectId,
      subjectNme: sub.subjectName,
      totalGrades: sub.totalGrads,
      BG: sub.BG,
      BD: sub.BD
    }));
  }


  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

    const Delete = await this.subjectsService.remove(id);


    return { message: 'Subject deleted successfully' };
  }


  @Get('counter')
  getSubjectCount() {
    return this.subjectsService.StubjectCount();
  }

}
