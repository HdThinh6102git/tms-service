import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTopicRegistrationPhaseInput,
  TopicRegistrationPhaseFilter,
  TopicRegistrationPhaseOutput,
  UpdateTopicRegistrationPhaseInput,
} from '../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistrationPhase } from '#entity/topic-registration-phase.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Admin } from '#entity/user/admin.entity';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class TopicRegistrationPhaseService {
  constructor(
    @InjectRepository(TopicRegistrationPhase)
    private topicRegistrationPhaseRepo: Repository<TopicRegistrationPhase>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  public async createTopicRegistrationPhase(
    input: CreateTopicRegistrationPhaseInput,
    adminId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
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
    const topicRegistrationPhase = await this.topicRegistrationPhaseRepo.save({
      ...input,
      admin: admin,
    });
    const topicRegistrationPhaseOutput = plainToClass(
      TopicRegistrationPhaseOutput,
      topicRegistrationPhase,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationPhaseOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateTopicRegistrationPhase(
    input: UpdateTopicRegistrationPhaseInput,
    topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    const topicRegistrationPhaseExist =
      await this.topicRegistrationPhaseRepo.findOne({
        where: {
          id: topicRegistrationPhaseId,
        },
        relations: ['admin'],
      });
    if (!topicRegistrationPhaseExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_PHASE_NOT_FOUND,
        code: 4,
      });
    }
    if (input.title) {
      topicRegistrationPhaseExist.title = input.title;
    }
    if (input.description) {
      topicRegistrationPhaseExist.description = input.description;
    }
    if (input.startDate) {
      topicRegistrationPhaseExist.startDate = input.startDate;
    }
    if (input.finishDate) {
      topicRegistrationPhaseExist.finishDate = input.finishDate;
    }
    const updatedTopicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.save(topicRegistrationPhaseExist);
    const topicRegistrationPhaseOutput = plainToClass(
      TopicRegistrationPhaseOutput,
      updatedTopicRegistrationPhase,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationPhaseOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getTopicRegistrationPhases(
    filter: TopicRegistrationPhaseFilter,
  ): Promise<BasePaginationResponse<TopicRegistrationPhaseOutput>> {
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
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          title: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          description: ILike(`%${filter.keyword}%`),
        },
      ];
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const topicRegistrationPhases = await this.topicRegistrationPhaseRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['admin'],
    });
    const count = await this.topicRegistrationPhaseRepo.count({
      where: wheres,
    });
    const topicRegistrationPhasesOutput = plainToInstance(
      TopicRegistrationPhaseOutput,
      topicRegistrationPhases,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      listData: topicRegistrationPhasesOutput,
      total: count,
    };
  }

  public async getTopicRegistrationPhaseById(
    topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    const topicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.findOne({
        where: { id: topicRegistrationPhaseId, deletedAt: IsNull() },
        relations: ['admin'],
      });
    if (!topicRegistrationPhase) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_PHASE_NOT_FOUND,
        code: 4,
      });
    }
    const topicRegistrationPhaseOutput = plainToClass(
      TopicRegistrationPhaseOutput,
      topicRegistrationPhase,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationPhaseOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteTopicRegistrationPhase(
    topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    const topicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.findOne({
        where: { id: topicRegistrationPhaseId, deletedAt: IsNull() },
        relations: ['admin'],
      });
    if (!topicRegistrationPhase) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_PHASE_NOT_FOUND,
        code: 4,
      });
    }
    topicRegistrationPhase.deletedAt = new Date();
    await this.topicRegistrationPhaseRepo.save(topicRegistrationPhase);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteTopicRegistrationPhasePermanently(
    topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<null>> {
    const topicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.findOne({
        where: { id: topicRegistrationPhaseId, deletedAt: Not(IsNull()) },
      });
    if (!topicRegistrationPhase) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_PHASE_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.topicRegistrationPhaseRepo.delete(topicRegistrationPhaseId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreTopicRegistrationPhase(
    topicRegistrationPhaseId: string,
  ): Promise<BaseApiResponse<TopicRegistrationPhaseOutput>> {
    const topicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.findOne({
        where: { id: topicRegistrationPhaseId, deletedAt: Not(IsNull()) },
      });
    if (!topicRegistrationPhase) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_PHASE_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    topicRegistrationPhase.deletedAt = null;
    const updatedTopicRegistrationPhase =
      await this.topicRegistrationPhaseRepo.save(topicRegistrationPhase);
    const topicRegistrationPhaseOutput = plainToClass(
      TopicRegistrationPhaseOutput,
      updatedTopicRegistrationPhase,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationPhaseOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
