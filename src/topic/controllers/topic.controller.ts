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
import {
  JwtAdminAuthGuard,
  JwtStudentAuthGuard,
  JwtTeacherAuthGuard,
} from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicInput,
  MajorTopicFilter,
  MajorTopicOutput,
  TopicFilter,
  TopicOutput,
  UpdateTopicInput,
} from '../dtos';
import { TOPIC_STATUS } from '#entity/topic.entity';

@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  public async createNewTopic(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateTopicInput,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.createTopic(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async updateTopic(
    @Param('id') topicId: string,
    @Body() body: UpdateTopicInput,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.updateTopic(body, topicId);
  }

  @Get('/filter')
  @UseGuards(JwtAdminAuthGuard)
  public async getTopics(
    @Query() query: TopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    return this.topicService.getTopics(query);
  }

  @Get('/references/filter')
  public async getTopicReferences(
    @Query() query: TopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    query.status = TOPIC_STATUS.STUDENT_ACTIVE;
    return this.topicService.getTopics(query);
  }

  @Get('student')
  @UseGuards(JwtStudentAuthGuard)
  public async getRegistrationTopicsForStudents(
    @Query() query: TopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    return this.topicService.getRegistrationTopicsForStudents(query);
  }

  @Get(':majorId/filter')
  @UseGuards(JwtTeacherAuthGuard)
  public async getTopicsByMajor(
    @Param('majorId') majorId: string,
    @Query() query: MajorTopicFilter,
  ): Promise<BasePaginationResponse<MajorTopicOutput>> {
    return this.topicService.getTopicsByMajor(query, majorId);
  }

  @Get(':id')
  public async getTopicById(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.getTopicById(topicId);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async deleteTopic(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicService.deleteTopic(topicId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAdminAuthGuard)
  public async deleteTopicPermanently(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.topicService.deleteTopicPermanently(topicId);
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAdminAuthGuard)
  public async retoreTopic(
    @Param('id') topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    return await this.topicService.restoreTopic(topicId);
  }
}
