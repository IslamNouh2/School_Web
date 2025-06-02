import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './DTO/CreateLocal.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Roles('ADMIN')
@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) { }


  @Get()
  async getStudents(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sort') sort: string
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const validSortFields = ['dateCreate', 'code', 'ClassName']
    const orderByField = validSortFields.includes(sort) ? sort : 'dateCreate'

    return this.localService.GetLocal(pageNumber, limitNumber, orderByField);
  }

  @Post('create')
  async CreateLocal(@Body() dto: CreateLocalDto) {
    const Local = await this.localService.CreateLocal(dto);
    return Local;
  }


  @Delete(':id')
  async DeleteLocal(
    @Param('id', ParseIntPipe) id: number
  ) {
    const Delete = await this.localService.DeleteLocal(id);
    return { message: 'Local deleted successfully' };
  }


  @Put('/:id')
  async UpdateLocals(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateLocalDto
  ) {
    const Local = await this.localService.UpdateLocal(id, dto);
    return Local;
  }

  @Get('counter')
  getSubjectCount() {
    return this.localService.CountLocals();
  }
}
