import {
  Body,
  Controller,
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTopicRegistrationStatus(
    @Param('id') topicRegistrationId: string,
    @Body() body: UpdateTopicRegistrationInput,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    return await this.topicRegistrationService.updateTopicRegistrationStatus(
      body,
      topicRegistrationId,
    );
  }
}
