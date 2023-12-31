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
import { TopicRegistrationService } from '../providers';
import {
  JwtMajorHeadAuthGuard,
  JwtStudentAuthGuard,
  JwtTeacherAuthGuard,
} from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import {
  BaseApiResponse,
  BasePaginationResponse,
  PaginationParamsDto,
} from '../../shared/dtos';
import {
  CreateStudentTopicRegistrationInput,
  CreateTopicRegistrationInput,
  EvaluateTeacherTopicRegistrationInput,
  TopicRegistrationOutput,
  UpdateTopicRegistrationInput,
} from '../dtos';

@Controller('topic-registration')
export class TopicRegistrationController {
  constructor(private topicRegistrationService: TopicRegistrationService) {}

  @Post('teacher')
  @UseGuards(JwtTeacherAuthGuard)
  public async createTeacherTopicRegistration(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.createTeacherTopicRegistration(
      body,
      ctx.user.id,
    );
  }

  @Post('student')
  @UseGuards(JwtStudentAuthGuard)
  public async createStudentTopicRegistration(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateStudentTopicRegistrationInput,
  ): Promise<BaseApiResponse<null>> {
    return await this.topicRegistrationService.createStudentTopicRegistration(
      body,
      ctx.user.id,
    );
  }

  @Patch(':id/teacher/evaluate')
  @UseGuards(JwtMajorHeadAuthGuard)
  public async evaluateTeacherTopicRegistration(
    @Param('id') topicRegistrationId: string,
    @Body() body: EvaluateTeacherTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.evaluateTeacherTopicRegistration(
      body,
      topicRegistrationId,
    );
  }

  @Patch(':id/student/evaluate')
  @UseGuards(JwtStudentAuthGuard)
  public async evaluateStudentTopicRegistration(
    @Param('id') topicRegistrationId: string,
    @Body() body: UpdateTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.evaluateStudentTopicRegistration(
      body,
      topicRegistrationId,
    );
  }

  @Delete('cancellation/:id/teacher')
  @UseGuards(JwtTeacherAuthGuard)
  public async cancelTeacherTopicRegistration(
    @Param('id') topicRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationService.cancelTeacherTopicRegistration(
      topicRegistrationId,
    );
  }

  @Delete('cancellation/:id/student')
  @UseGuards(JwtStudentAuthGuard)
  public async cancelStudentTopicRegistration(
    @Param('id') topicRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationService.cancelStudentTopicRegistration(
      topicRegistrationId,
    );
  }

  @Get('/waiting-student-confirm/:topicId')
  @UseGuards(JwtStudentAuthGuard)
  public async getWaitingStudentConfirmTopicRegistrations(
    @Param('topicId') topicId: string,
    @Query() query: PaginationParamsDto,
  ): Promise<BasePaginationResponse<TopicRegistrationOutput>> {
    return this.topicRegistrationService.getWaitingStudentConfirmTopicRegistrations(
      topicId,
      query,
    );
  }
}
