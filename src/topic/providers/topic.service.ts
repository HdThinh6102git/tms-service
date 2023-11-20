import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Admin } from '#entity/user/admin.entity';
import { Topic } from '#entity/topic.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateTopicInput,
  TopicFilter,
  TopicOutput,
  UpdateTopicInput,
} from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '#entity/user/user.entity';
import { ROLE } from '../../auth/constants';
import { UserOutputDto } from '../../user/dtos';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepo: Repository<Topic>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  public async createTopic(
    input: CreateTopicInput,
    adminId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    const admin = await this.adminRepo.findOne({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.ADMIN_NOT_FOUND,
        code: 4,
      });
    }
    let teacherOutput = null;
    if (input.reviewTeacher) {
      const teacher = await this.userRepo.findOne({
        where: {
          id: input.reviewTeacher,
          role: { name: ROLE.TEACHER },
        },
      });
      if (!teacher) {
        throw new NotFoundException({
          error: true,
          data: null,
          message: MESSAGES.TEACHER_NOT_FOUND,
          code: 4,
        });
      }
      teacherOutput = plainToClass(UserOutputDto, teacher, {
        excludeExtraneousValues: true,
      });
    }

    const topic = await this.topicRepo.save({
      ...input,
      admin: admin,
    });
    const topicOutput = plainToClass(TopicOutput, topic, {
      excludeExtraneousValues: true,
    });

    topicOutput.reviewTeacher = teacherOutput;
    return {
      error: false,
      data: topicOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateTopic(
    input: UpdateTopicInput,
    topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    const topicExist = await this.topicRepo.findOne({
      where: {
        id: topicId,
      },
      relations: ['admin'],
    });
    if (!topicExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND,
        code: 4,
      });
    }
    if (input.name) {
      topicExist.name = input.name;
    }
    if (input.detail) {
      topicExist.detail = input.detail;
    }
    if (input.startDate) {
      topicExist.startDate = input.startDate;
    }
    if (input.finishDate) {
      topicExist.finishDate = input.finishDate;
    }
    if (input.reviewTeacher) {
      topicExist.reviewTeacher = input.reviewTeacher;
    }
    const updatedTopic = await this.topicRepo.save(topicExist);
    const topicOutput = plainToClass(TopicOutput, updatedTopic, {
      excludeExtraneousValues: true,
    });
    let teacherOutput = null;
    if (topicExist.reviewTeacher) {
      const teacher = await this.userRepo.findOne({
        where: {
          id: topicExist.reviewTeacher,
          role: { name: ROLE.TEACHER },
        },
      });
      teacherOutput = plainToClass(UserOutputDto, teacher, {
        excludeExtraneousValues: true,
      });
    }
    topicOutput.reviewTeacher = teacherOutput;
    return {
      error: false,
      data: topicOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getTopics(
    filter: TopicFilter,
  ): Promise<BasePaginationResponse<TopicOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.startDate) {
      where['startDate'] = filter.startDate;
    }
    if (filter.finishDate) {
      where['finishDate'] = filter.finishDate;
    }
    if (filter.userKeyword) {
      let wheresUser: any[] = [];
      wheresUser = [
        {
          ...where,
          username: ILike(`%${filter.userKeyword}%`),
        },
        {
          ...where,
          name: ILike(`%${filter.userKeyword}%`),
        },
        {
          ...where,
          email: ILike(`%${filter.userKeyword}%`),
        },
      ];
      const teacher = await this.userRepo.findOne({
        where: wheresUser,
      });
      if (teacher) {
        where['reviewTeacher'] = teacher.id;
      }
    }
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          name: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          detail: ILike(`%${filter.keyword}%`),
        },
      ];
    }

    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const topics = await this.topicRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['admin'],
    });
    const count = await this.topicRepo.count({
      where: wheres,
    });
    const topicsOutput = plainToInstance(TopicOutput, topics, {
      excludeExtraneousValues: true,
    });
    return {
      listData: topicsOutput,
      total: count,
    };
  }

  public async getTopicById(
    topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, deletedAt: IsNull() },
      relations: ['admin'],
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND,
        code: 4,
      });
    }
    const topicOutput = plainToClass(TopicOutput, topic, {
      excludeExtraneousValues: true,
    });
    const teacher = await this.userRepo.findOne({
      where: {
        id: topic.reviewTeacher,
        role: { name: ROLE.TEACHER },
      },
    });
    const teacherOutput = plainToClass(UserOutputDto, teacher, {
      excludeExtraneousValues: true,
    });
    topicOutput.reviewTeacher = teacherOutput;
    return {
      error: false,
      data: topicOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteTopic(topicId: string): Promise<BaseApiResponse<null>> {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, deletedAt: IsNull() },
      relations: ['admin'],
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND,
        code: 4,
      });
    }
    topic.deletedAt = new Date();
    await this.topicRepo.save(topic);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteTopicPermanently(
    topicId: string,
  ): Promise<BaseApiResponse<null>> {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, deletedAt: Not(IsNull()) },
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.topicRepo.delete(topicId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreTopic(
    topicId: string,
  ): Promise<BaseApiResponse<TopicOutput>> {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, deletedAt: Not(IsNull()) },
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    topic.deletedAt = null;
    const updatedTopic = await this.topicRepo.save(topic);
    const topicOutput = plainToClass(TopicOutput, updatedTopic, {
      excludeExtraneousValues: true,
    });
    const teacher = await this.userRepo.findOne({
      where: {
        id: topic.reviewTeacher,
        role: { name: ROLE.TEACHER },
      },
    });
    const teacherOutput = plainToClass(UserOutputDto, teacher, {
      excludeExtraneousValues: true,
    });
    topicOutput.reviewTeacher = teacherOutput;
    return {
      error: false,
      data: topicOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
