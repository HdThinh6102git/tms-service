import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRegistration } from '#entity/topic-registration.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { StudentProject } from '#entity/student-project.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import { MESSAGES } from '../../../shared/constants';
import { Topic } from '#entity/topic.entity';
import { User } from '#entity/user/user.entity';
import { ROLE } from '../../../auth/constants';
import {
  StudentProjectFilter,
  StudentProjectOutput,
  UserOutputDto,
} from '../../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StudentProjectService {
  constructor(
    @InjectRepository(StudentProject)
    private studentProjectRepo: Repository<StudentProject>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createStudentProjectByTeacher(
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

  public async createStudentProjectByStudent(
    topic: Topic,
    studentId: string,
    role: string,
    status: number,
  ): Promise<BaseApiResponse<StudentProject>> {
    const studentProject = await this.studentProjectRepo.save({
      studentId: studentId,
      topic: topic,
      role: role,
      status: status,
    });
    return {
      error: false,
      data: studentProject,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async getStudentProjects(
    filter: StudentProjectFilter,
  ): Promise<BasePaginationResponse<StudentProjectOutput>> {
    const where: any = {
      id: Not(IsNull()),
    };
    if (filter.topicId) {
      where['topic'] = { id: filter.topicId };
    }
    const studentProjects = await this.studentProjectRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.studentProjectRepo.count({
      where: where,
    });
    const studentProjectsOutput = plainToInstance(
      StudentProjectOutput,
      studentProjects,
      {
        excludeExtraneousValues: true,
      },
    );
    for (let i = 0; i < studentProjectsOutput.length; i++) {
      const studentInfo = await this.userRepo.findOne({
        where: {
          id: studentProjects[i].studentId,
        },
      });
      const studentInfoOutput = plainToInstance(UserOutputDto, studentInfo, {
        excludeExtraneousValues: true,
      });
      if (studentInfo) {
        studentProjectsOutput[i].studentInfor = studentInfoOutput;
      }
    }
    return {
      listData: studentProjectsOutput,
      total: count,
    };
  }
}
