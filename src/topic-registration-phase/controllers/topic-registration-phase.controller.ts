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
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicRegistrationPhaseInput,
  TopicRegistrationPhaseFilter,
  TopicRegistrationPhaseOutput,
  UpdateTopicRegistrationPhaseInput,
} from '../dtos';

@Controller('admin/topic-registration-phase')
export class TopicRegistrationPhaseController {
  constructor(
    private topicRegistrationPhaseService: TopicRegistrationPhaseService,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  public async getTopicRegistrationPhases(
    @Query() query: TopicRegistrationPhaseFilter,
  ): Promise<BasePaginationResponse<TopicRegistrationPhaseOutput>> {
    return this.topicRegistrationPhaseService.getTopicRegistrationPhases(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getTopicRegistrationPhaseById(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.getTopicRegistrationPhaseById(
      topicRegistrationPhaseId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteTopicRegistrationPhase(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationPhaseService.deleteTopicRegistrationPhase(
      topicRegistrationPhaseId,
    );
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteTopicRegistrationPhasePermanently(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicRegistrationPhaseService.deleteTopicRegistrationPhasePermanently(
      topicRegistrationPhaseId,
    );
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAuthGuard)
  public async retoreTopicRegistrationPhase(
    @Param('id') topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    return await this.topicRegistrationPhaseService.restoreTopicRegistrationPhase(
      topicRegistrationPhaseId,
    );
  }
}
