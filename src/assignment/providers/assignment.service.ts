import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { Assignment } from '#entity/assignment.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  AssignmentFilter,
  AssignmentOutput,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { Topic, TOPIC_STATUS } from '#entity/topic.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Topic)
    private topicRepo: Repository<Topic>,
  ) {}

  public async createAssignment(
    input: CreateAssignmentInput,
    userId: string,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const topic = await this.topicRepo.findOne({
      where: {
        id: input.topicId,
        status: TOPIC_STATUS.STUDENT_ACTIVE,
      },
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.TOPIC_NOT_FOUND,
        code: 4,
      });
    }
    const assignment = await this.assignmentRepo.save({
      ...input,
      topic: topic,
    });
    const assignmentOutput = plainToClass(AssignmentOutput, assignment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: assignmentOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateAssignment(
    input: UpdateAssignmentInput,
    assignmentId: string,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    const assignmentExist = await this.assignmentRepo.findOne({
      where: {
        id: assignmentId,
      },
    });
    if (!assignmentExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ASSIGNMENT_NOT_EXIST,
        code: 4,
      });
    }
    //check data input to update
    if (input.title) {
      assignmentExist.title = input.title;
    }
    if (input.description) {
      assignmentExist.description = input.description;
    }
    if (input.startAt) {
      assignmentExist.startAt = input.startAt;
    }
    if (input.finishAt) {
      assignmentExist.finishAt = input.finishAt;
    }
    if (typeof input.status == 'number') {
      assignmentExist.status = input.status;
    }
    if (typeof input.score == 'number') {
      assignmentExist.score = input.score;
    }
    if (input.resultText) {
      assignmentExist.resultText = input.resultText;
    }
    const updatedAssignment = await this.assignmentRepo.save(assignmentExist);
    //convert to output
    const assignmentOutput = plainToClass(AssignmentOutput, updatedAssignment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: assignmentOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async updateResultFile(
    imgUrl: string,
    assignmentId: string,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    const assignmentExist = await this.assignmentRepo.findOne({
      where: {
        id: assignmentId,
      },
    });
    if (!assignmentExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ASSIGNMENT_NOT_EXIST,
        code: 4,
      });
    }
    if (imgUrl) {
      assignmentExist.resultFile = imgUrl;
    }
    const updatedAssignment = await this.assignmentRepo.save(assignmentExist);
    //convert to output
    const assignmentOutput = plainToClass(AssignmentOutput, updatedAssignment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: assignmentOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getAssignments(
    filter: AssignmentFilter,
  ): Promise<BasePaginationResponse<AssignmentOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.startAt) {
      where['startAt'] = filter.startAt;
    }
    if (filter.finishAt) {
      where['finishAt'] = filter.finishAt;
    }
    if (typeof filter.score === 'number') {
      where['score'] = filter.score;
    }
    if (filter.topicId) {
      where['topic'] = { id: filter.topicId };
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
    const assignments = await this.assignmentRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.assignmentRepo.count({
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
    });
    const assignmentsOutput = plainToInstance(AssignmentOutput, assignments, {
      excludeExtraneousValues: true,
    });
    return {
      listData: assignmentsOutput,
      total: count,
    };
  }

  public async getAssignmentById(
    assignmentId: string,
  ): Promise<BaseApiResponse<AssignmentOutput>> {
    const assignment = await this.assignmentRepo.findOne({
      where: {
        id: assignmentId,
      },
    });
    if (!assignment) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ASSIGNMENT_NOT_EXIST,
        code: 4,
      });
    }
    const assignmentOutput = plainToClass(AssignmentOutput, assignment, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: assignmentOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteAssignmentPermanently(
    assignmentId: string,
  ): Promise<BaseApiResponse<null>> {
    const assignment = await this.assignmentRepo.findOne({
      where: {
        id: assignmentId,
      },
    });
    if (!assignment) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ASSIGNMENT_NOT_EXIST,
        code: 4,
      });
    }
    await this.assignmentRepo.delete(assignmentId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }
}
