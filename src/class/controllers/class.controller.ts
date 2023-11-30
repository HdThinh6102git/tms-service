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
import { JwtAdminAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  ClassFilter,
  ClassOutput,
  CreateClassInput,
  UpdateClassInput,
} from '../dtos';
@UseGuards(JwtAdminAuthGuard)
@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Post()
  public async createClass(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateClassInput,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.createClass(body, ctx.user.id);
  }

  @Patch(':id')
  public async updateClass(
    @Param('id') classId: string,
    @Body() body: UpdateClassInput,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.updateClass(body, classId);
  }

  @Get('/filter')
  public async getClasses(
    @Query() query: ClassFilter,
  ): Promise<BasePaginationResponse<ClassOutput>> {
    return this.classService.getClasses(query);
  }

  @Get(':id')
  public async getClassById(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.getClassById(classId);
  }

  @Delete(':id')
  public async deleteClass(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.classService.deleteClass(classId);
  }

  @Delete('permanently/:id')
  public async deleteClassPermanently(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.classService.deleteClassPermanently(classId);
  }

  @Patch('restoration/:id')
  public async retoreClass(
    @Param('id') classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    return await this.classService.restoreClass(classId);
  }
}
