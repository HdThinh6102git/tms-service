import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistration } from '#entity/topic-registration.entity';
import { Repository } from 'typeorm';
import { StudentProject } from '#entity/student-project.entity';
import { BaseApiResponse } from '../../../shared/dtos';
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
  ): Promise<BaseApiResponse<StudentProject>> {
    let studentProjectStatus;
    if (creatorRole == ROLE.TEACHER) {
      studentProjectStatus = topicRegistration.status;
    }
    const studentProject = await this.studentProjectRepo.save({
      studentId: student.id,
      topic: topic,
      topicRegistration: topicRegistration,
      role: role,
      status: studentProjectStatus,
    });
    return {
      error: false,
      data: studentProject,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }
}
