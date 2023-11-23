import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistration } from '#entity/topic-registration.entity';
import { Repository } from 'typeorm';
import {
  STUDENT_PROJECT_STATUS,
  StudentProject,
} from '#entity/student-project.entity';
import { BaseApiResponse } from '../../../shared/dtos';
import { StudentProjectOutput, UserOutputDto } from '../../dtos';
import { plainToClass } from 'class-transformer';
import { MESSAGES } from '../../../shared/constants';
import { Topic } from '#entity/topic.entity';
import { User } from '#entity/user/user.entity';
import { ROLE } from '../../../auth/constants';

@Injectable()
export class StudentProjectService {
  constructor(
    @InjectRepository(StudentProject)
    private studentProjectRepo: Repository<StudentProject>,
  ) {}

  public async createStudentProject(
    topicRegistration: TopicRegistration,
    topic: Topic,
    student: User,
    role: string,
    creatorRole: string,
  ): Promise<BaseApiResponse<StudentProjectOutput>> {
    let studentProjectStatus;
    if (creatorRole == ROLE.STUDENT) {
      studentProjectStatus = STUDENT_PROJECT_STATUS.WAITING_CONFIRMATION;
    } else if (creatorRole == ROLE.TEACHER) {
      studentProjectStatus = STUDENT_PROJECT_STATUS.ACTIVE;
    }
    const studentProject = await this.studentProjectRepo.save({
      studentId: student.id,
      topic: topic,
      topicRegistration: topicRegistration,
      role: role,
      status: studentProjectStatus,
    });
    const studentProjectOutput = plainToClass(
      StudentProjectOutput,
      studentProject,
      {
        excludeExtraneousValues: true,
      },
    );
    const studentOutput = plainToClass(UserOutputDto, student, {
      excludeExtraneousValues: true,
    });
    studentProjectOutput.studentInfor = studentOutput;
    return {
      error: false,
      data: studentProjectOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }
}
