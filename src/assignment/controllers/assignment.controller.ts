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
import { AssignmentService } from '../providers';
import { JwtAuthGuard, JwtTeacherAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  AssignmentFilter,
  AssignmentOutput,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from '../dtos';

@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Post()
  @UseGuards(JwtTeacherAuthGuard)
  public async createAssignment(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateAssignmentInput,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    return await this.assignmentService.createAssignment(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateAssignment(
    @Param('id') assignmentId: string,
    @Body() body: UpdateAssignmentInput,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    return await this.assignmentService.updateAssignment(body, assignmentId);
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getAssignments(
    @Query() query: AssignmentFilter,
  ): Promise<BasePaginationResponse<AssignmentOutput>> {
    return this.assignmentService.getAssignments(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getAssignmentById(
    @Param('id') assignmentId: string,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    return await this.assignmentService.getAssignmentById(assignmentId);
  }

  @Delete(':id')
  @UseGuards(JwtTeacherAuthGuard)
  public async deleteAssignmentPermanently(
    @Param('id') assignmentId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.assignmentService.deleteAssignmentPermanently(assignmentId);
  }
}
