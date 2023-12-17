import { Controller, Get, Query } from '@nestjs/common';
import { BasePaginationResponse } from '../../../shared/dtos';
import { StudentProjectService } from '../../providers';
import { StudentProjectFilter, StudentProjectOutput } from '../../dtos';

@Controller('student-project')
export class StudentProjectController {
  constructor(private studentProjectService: StudentProjectService) {}

  @Get('/filter')
  public async getStudentProjects(
    @Query() query: StudentProjectFilter,
  ): Promise<BasePaginationResponse<StudentProjectOutput>> {
    return this.studentProjectService.getStudentProjects(query);
  }
}
