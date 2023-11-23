import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistration, TYPE } from '#entity/topic-registration.entity';
import { Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { Topic } from '#entity/topic.entity';
import { CreateTopicRegistrationInput, TopicRegistrationOutput } from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass } from 'class-transformer';
import { StudentProjectService } from '../../user/providers';
import { ROLE_ID } from '../../auth/constants';

@Injectable()
export class TopicRegistrationService {
  constructor(
    private studentProjectService: StudentProjectService,
    @InjectRepository(TopicRegistration)
    private topicRegistrationRepo: Repository<TopicRegistration>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Topic)
    private topicRepo: Repository<Topic>,
  ) {}

  public async createTeacherTopicRegistration(
    input: CreateTopicRegistrationInput,
    userId: string,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    const topic = await this.topicRepo.findOne({
      where: {
        id: input.topicId,
      },
    });
    if (!topic) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_NOT_FOUND,
        code: 4,
      });
    }
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
    const student = await this.userRepo.findOne({
      where: {
        email: input.studentEmail,
        role: { id: ROLE_ID.STUDENT },
      },
    });
    if (!student) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.STUDENT_NOT_EXIST,
        code: 4,
      });
    }
    const userRegistered = await this.topicRegistrationRepo.findOne({
      where: {
        topic: { id: input.topicId },
        user: { id: userId },
      },
    });
    if (userRegistered) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.USER_REGISTERED_THIS_TOPIC,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const topicRegistration = await this.topicRegistrationRepo.save({
      ...input,
      topic: topic,
      user: user,
      type: TYPE.TEACHER,
    });
    await this.studentProjectService.createStudentProject(
      topicRegistration,
      topic,
      student,
    );
    const topicRegistrationOutput = plainToClass(
      TopicRegistrationOutput,
      topicRegistration,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }
}
