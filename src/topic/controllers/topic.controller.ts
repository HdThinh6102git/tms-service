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
import { TopicService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicInput,
  TopicFilter,
  TopicOutput,
  UpdateTopicInput,
} from '../dtos';

@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewTopic(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateTopicInput,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.createTopic(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTopic(
    @Param('id') topicId: string,
    @Body() body: UpdateTopicInput,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.updateTopic(body, topicId);
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getTopics(
    @Query() query: TopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    return this.topicService.getTopics(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getTopicById(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.getTopicById(topicId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteTopic(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicService.deleteTopic(topicId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteTopicPermanently(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicService.deleteTopicPermanently(topicId);
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAuthGuard)
  public async retoreTopic(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.restoreTopic(topicId);
  }
}
