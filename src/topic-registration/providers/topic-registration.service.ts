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
import { Topic, TOPIC_STATUS } from '#entity/topic.entity';
import {
  CreateStudentTopicRegistrationInput,
  CreateTopicRegistrationInput,
  EvaluateTeacherTopicRegistrationInput,
  TopicRegistrationOutput,
  UpdateTopicRegistrationInput,
} from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass } from 'class-transformer';
import { StudentProjectService } from '../../user/providers';
import { ROLE } from '../../auth/constants';
import {
  PROJECT_ROLE,
  STUDENT_PROJECT_STATUS,
  StudentProject,
} from '#entity/student-project.entity';

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
    @InjectRepository(StudentProject)
    private studentProjectRepo: Repository<StudentProject>,
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
      relations: ['role'],
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
            role: { name: ROLE.STUDENT },
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
          await this.studentProjectService.createStudentProjectByTeacher(
            topicRegistration,
            topic,
            firstStudent,
            PROJECT_ROLE.LEADER,
            user.role.name,
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
            role: { name: ROLE.STUDENT },
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
        await this.studentProjectService.createStudentProjectByTeacher(
          topicRegistration,
          topic,
          secondStudent,
          studentProjectRole,
          user.role.name,
        );
      }
      await this.topicRepo.update(
        { id: topic.id },
        { status: TOPIC_STATUS.WAITING_CONFIRMATION },
      );
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

  public async createStudentTopicRegistration(
    input: CreateStudentTopicRegistrationInput,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const topic = await this.topicRepo.findOne({
      where: {
        id: input.topicId,
        status: TOPIC_STATUS.STUDENT_ACTIVE,
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
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    if (user.role.name != ROLE.STUDENT) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.ACCESSIBLE_ONLY_TO_STUDENTS,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const numberStudentInTopic = await this.studentProjectRepo.count({
      where: {
        topic: { id: input.topicId },
      },
    });
    const userRegistered = await this.studentProjectRepo.findOne({
      where: {
        topic: { id: input.topicId },
        studentId: userId,
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
    if (numberStudentInTopic == 0) {
      await this.studentProjectService.createStudentProjectByStudent(
        topic,
        user.id,
        PROJECT_ROLE.LEADER,
        STUDENT_PROJECT_STATUS.ACTIVE,
      );
    } else if (numberStudentInTopic == 1) {
      await this.topicRegistrationRepo.save({
        ...input,
        topic: topic,
        user: user,
        type: TYPE.STUDENT,
      });
    } else if (numberStudentInTopic == 2) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.THIS_TOPIC_FULLY_REGISTERED,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      error: false,
      data: null,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async evaluateTeacherTopicRegistration(
    input: EvaluateTeacherTopicRegistrationInput,
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
      if (input.status == 2) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.REFUSED;
        await this.studentProjectRepo.update(
          { topicRegistration: { id: topicRegistrationExist.id } },
          { status: topicRegistrationExist.status },
        );
      } else if (input.status == 3) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.ACCEPTED;
        if (input.reviewTeacher) {
          await this.topicRepo.update(
            { id: topicRegistrationExist.topic.id },
            {
              status: TOPIC_STATUS.STUDENT_ACTIVE,
              reviewTeacher: input.reviewTeacher,
            },
          );
        } else {
          await this.topicRepo.update(
            { id: topicRegistrationExist.topic.id },
            { status: TOPIC_STATUS.STUDENT_ACTIVE },
          );
        }
        await this.studentProjectRepo.update(
          { topicRegistration: { id: topicRegistrationExist.id } },
          { status: topicRegistrationExist.status },
        );
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

  public async evaluateStudentTopicRegistration(
    input: UpdateTopicRegistrationInput,
    topicRegistrationId: string,
  ): Promise<BaseApiResponse<TopicRegistrationOutput>> {
    const topicRegistrationExist = await this.topicRegistrationRepo.findOne({
      where: {
        id: topicRegistrationId,
        type: TYPE.STUDENT,
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
      if (input.status == 2) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.REFUSED;
      } else if (input.status == 3) {
        topicRegistrationExist.status = TOPIC_REGISTRATION_STATUS.ACCEPTED;
        const topic = await this.topicRepo.findOne({
          where: {
            id: topicRegistrationExist.topic.id,
          },
        });
        if (topic) {
          await this.studentProjectService.createStudentProjectByStudent(
            topic,
            topicRegistrationExist.user.id,
            PROJECT_ROLE.MEMBER,
            STUDENT_PROJECT_STATUS.ACTIVE,
          );
        }
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

  public async cancelTeacherTopicRegistration(
    topicRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    const topicRegistration = await this.topicRegistrationRepo.findOne({
      where: {
        id: topicRegistrationId,
        type: TYPE.TEACHER,
        status: TOPIC_REGISTRATION_STATUS.WAITING_CONFIRMATION,
      },
      relations: ['topic'],
    });
    if (!topicRegistration) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_NOT_FOUND,
        code: 4,
      });
    }
    await this.studentProjectRepo.delete({
      topicRegistration: { id: topicRegistration.id },
    });
    await this.topicRegistrationRepo.delete(topicRegistrationId);
    await this.topicRepo.update(
      { id: topicRegistration.topic.id },
      { status: TOPIC_STATUS.TEACHER_ACTIVE },
    );
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async cancelStudentTopicRegistration(
    topicRegistrationId: string,
  ): Promise<BaseApiResponse<null>> {
    const topicRegistration = await this.topicRegistrationRepo.findOne({
      where: {
        id: topicRegistrationId,
        type: TYPE.STUDENT,
        status: TOPIC_REGISTRATION_STATUS.WAITING_CONFIRMATION,
      },
    });
    if (!topicRegistration) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.TOPIC_REGISTRATION_NOT_FOUND,
        code: 4,
      });
    }
    await this.topicRegistrationRepo.delete(topicRegistrationId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }
}
