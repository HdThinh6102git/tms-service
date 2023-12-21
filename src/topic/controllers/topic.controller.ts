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
  JwtAuthGuard,
  JwtMajorHeadAuthGuard,
  JwtStudentAuthGuard,
  JwtTeacherAuthGuard,
} from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicInput,
  MajorTopicFilter,
  MajorTopicOutput,
  OnGoingTopicFilter,
  TeacherTopicFilter,
  TeacherTopicOutput,
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

  @Get('teacher')
  @UseGuards(JwtTeacherAuthGuard)
  public async getTopicsForTeacher(
    @Query() query: TeacherTopicFilter,
    @ReqContext() ctx: RequestContext,
  ): Promise<BasePaginationResponse<TeacherTopicOutput>> {
    return this.topicService.getTopicsForTeacher(query, ctx.user.id);
  }

  @Get('major-head')
  @UseGuards(JwtMajorHeadAuthGuard)
  public async getTopicsForMajorHead(
    @Query() query: TeacherTopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    return this.topicService.getTopicsForMajorHead(query);
  }

  @Get('on-going')
  @UseGuards(JwtAuthGuard)
  public async getOnGoingTopics(
    @Query() query: OnGoingTopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    return this.topicService.getOnGoingTopics(query);
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
