import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TopicRegistrationService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse } from '../../shared/dtos';
import {
  CreateStudentTopicRegistrationInput,
  CreateTopicRegistrationInput,
  TopicRegistrationOutput,
  UpdateTopicRegistrationInput,
} from '../dtos';

@Controller('topic-registration')
export class TopicRegistrationController {
  constructor(private topicRegistrationService: TopicRegistrationService) {}

  @Post('teacher')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  public async evaluateTeacherTopicRegistration(
    @Param('id') topicRegistrationId: string,
    @Body() body: UpdateTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.evaluateTeacherTopicRegistration(
      body,
      topicRegistrationId,
    );
  }

  @Patch(':id/student/evaluate')
  @UseGuards(JwtAuthGuard)
  public async evaluateStudentTopicRegistration(
    @Param('id') topicRegistrationId: string,
    @Body() body: UpdateTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.evaluateStudentTopicRegistration(
      body,
      topicRegistrationId,
    );
  }

  @Delete('cancellation/:id')
  @UseGuards(JwtAuthGuard)
  public async cancelTeacherTopicRegistration(
    @Param('id') topicRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationService.cancelTeacherTopicRegistration(
      topicRegistrationId,
    );
  }
}
