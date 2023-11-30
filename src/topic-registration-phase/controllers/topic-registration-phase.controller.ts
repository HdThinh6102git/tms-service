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
import { TopicRegistrationPhaseService } from '../providers';
import { JwtAdminAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicRegistrationPhaseInput,
  TopicRegistrationPhaseFilter,
  TopicRegistrationPhaseOutput,
  UpdateTopicRegistrationPhaseInput,
} from '../dtos';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/topic-registration-phase')
export class TopicRegistrationPhaseController {
  constructor(
    private topicRegistrationPhaseService: TopicRegistrationPhaseService,
  ) {}

  @Post()
  public async createNewTopicRegistrationPhase(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateTopicRegistrationPhaseInput,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.createTopicRegistrationPhase(
      body,
      ctx.user.id,
    );
  }

  @Patch(':id')
  public async updateTopicRegistrationPhase(
    @Param('id') topicRegistrationPhaseId: string,
    @Body() body: UpdateTopicRegistrationPhaseInput,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.updateTopicRegistrationPhase(
      body,
      topicRegistrationPhaseId,
    );
  }

  @Get('/filter')
  public async getTopicRegistrationPhases(
    @Query() query: TopicRegistrationPhaseFilter,
  ): Promise<BasePaginationResponse<TopicRegistrationPhaseOutput>> {
    return this.topicRegistrationPhaseService.getTopicRegistrationPhases(query);
  }

  @Get(':id')
  public async getTopicRegistrationPhaseById(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.getTopicRegistrationPhaseById(
      topicRegistrationPhaseId,
    );
  }

  @Delete(':id')
  public async deleteTopicRegistrationPhase(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationPhaseService.deleteTopicRegistrationPhase(
      topicRegistrationPhaseId,
    );
  }

  @Delete('permanently/:id')
  public async deleteTopicRegistrationPhasePermanently(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationPhaseService.deleteTopicRegistrationPhasePermanently(
      topicRegistrationPhaseId,
    );
  }

  @Patch('restoration/:id')
  public async retoreTopicRegistrationPhase(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.restoreTopicRegistrationPhase(
      topicRegistrationPhaseId,
    );
  }
}
