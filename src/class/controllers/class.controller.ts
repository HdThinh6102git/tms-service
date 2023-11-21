import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  ClassFilter,
  ClassOutput,
  CreateClassInput,
  UpdateClassInput,
} from '../dtos';

@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createClass(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateClassInput,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.createClass(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateClass(
    @Param('id') classId: string,
    @Body() body: UpdateClassInput,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.updateClass(body, classId);
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getClasses(
    @Query() query: ClassFilter,
  ): Promise<BasePaginationResponse<ClassOutput>> {
    return this.classService.getClasses(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getClassById(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.getClassById(classId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteClass(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.classService.deleteClass(classId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteClassPermanently(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.classService.deleteClassPermanently(classId);
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAuthGuard)
  public async retoreClass(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.restoreClass(classId);
  }
}
