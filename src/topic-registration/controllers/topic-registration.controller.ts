import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TopicRegistrationService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse } from '../../shared/dtos';
import { CreateTopicRegistrationInput, TopicRegistrationOutput } from '../dtos';

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
}
