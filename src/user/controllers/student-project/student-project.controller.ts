import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasePaginationResponse } from '../../../shared/dtos';
import { StudentProjectService } from '../../providers';
import { StudentProjectFilter, StudentProjectOutput } from '../../dtos';
import { JwtAuthGuard } from '../../../auth/guards';

@Controller('student-project')
export class StudentProjectController {
  constructor(private studentProjectService: StudentProjectService) {}

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getStudentProjects(
    @Query() query: StudentProjectFilter,
  ): Promise<BasePaginationResponse<StudentProjectOutput>> {
    return this.studentProjectService.getStudentProjects(query);
  }
}
