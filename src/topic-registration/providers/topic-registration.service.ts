import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TOPIC_REGISTRATION_STATUS,
  TopicRegistration,
  TYPE,
} from '#entity/topic-registration.entity';
import { Repository } from 'typeorm';
import { User } from '#entity/user/user.entity';
import { Topic } from '#entity/topic.entity';
import {
  CreateTopicRegistrationInput,
  TopicRegistrationOutput,
  UpdateTopicRegistrationInput,
} from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass } from 'class-transformer';
import { StudentProjectService } from '../../user/providers';
import { ROLE_ID } from '../../auth/constants';
import { PROJECT_ROLE } from '#entity/student-project.entity';

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
    if (topicRegistration) {
      if (input.firstStudentEmail && input.secondStudentEmail) {
        if (input.firstStudentEmail == input.secondStudentEmail) {
          throw new HttpException(
            {
              error: true,
              message: MESSAGES.DUPLICATE_STUDENT_EMAIL,
              code: 4,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      let firstStudentProject: any;
      if (input.firstStudentEmail) {
        const firstStudent = await this.userRepo.findOne({
          where: {
            email: input.firstStudentEmail,
            role: { id: ROLE_ID.STUDENT },
          },
        });
        if (!firstStudent) {
          throw new NotFoundException({
            error: true,
            data: null,
            message: MESSAGES.STUDENT_NOT_EXIST,
            code: 4,
          });
        }
        firstStudentProject =
          await this.studentProjectService.createStudentProject(
            topicRegistration,
            topic,
            firstStudent,
            PROJECT_ROLE.LEADER,
          );
      }
      if (input.secondStudentEmail) {
        let studentProjectRole = PROJECT_ROLE.LEADER;
        if (firstStudentProject) {
          studentProjectRole = PROJECT_ROLE.MEMBER;
        }
        const secondStudent = await this.userRepo.findOne({
          where: {
            email: input.secondStudentEmail,
            role: { id: ROLE_ID.STUDENT },
          },
        });
        if (!secondStudent) {
          throw new NotFoundException({
            error: true,
            data: null,
            message: MESSAGES.STUDENT_NOT_EXIST,
            code: 4,
          });
        }
        await this.studentProjectService.createStudentProject(
          topicRegistration,
          topic,
          secondStudent,
          studentProjectRole,
        );
      }
    }
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

  public async updateTopicRegistrationStatus(
    input: UpdateTopicRegistrationInput,
    topicRegistrationId: string,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    const topicRegistrationExist = await this.topicRegistrationRepo.findOne({
      where: {
        id: topicRegistrationId,
      },
      relations: ['user', 'topic'],
    });
    if (!topicRegistrationExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_NOT_FOUND,
        code: 4,
      });
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.CANCELED;
      } else if (input.status == 1) {
        topicRegistrationExist.status =
          TOPIC_REGISTRATION_STATUS.WAITING_CONFIRMATION;
      } else if (input.status == 2) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.REFUSED;
      } else if (input.status == 3) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.ACCEPTED;
      }
    }
    const updatedTopicRegistration = await this.topicRegistrationRepo.save(
      topicRegistrationExist,
    );
    //convert to output
    const topicRegistrationOutput = plainToClass(
      TopicRegistrationOutput,
      updatedTopicRegistration,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: topicRegistrationOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
