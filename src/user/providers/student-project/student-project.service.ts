import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistration } from '#entity/topic-registration.entity';
import { Repository } from 'typeorm';
import { StudentProject } from '#entity/student-project.entity';
import { BaseApiResponse } from '../../../shared/dtos';
import { StudentProjectOutput, UserOutputDto } from '../../dtos';
import { plainToClass } from 'class-transformer';
import { MESSAGES } from '../../../shared/constants';
import { Topic } from '#entity/topic.entity';
import { User } from '#entity/user/user.entity';

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
  ): Promise<BaseApiResponse<StudentProjectOutput>> {
    const studentProject = await this.studentProjectRepo.save({
      studentId: student.id,
      topic: topic,
      topicRegistration: topicRegistration,
      role: role,
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
