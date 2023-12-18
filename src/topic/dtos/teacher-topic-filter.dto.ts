import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class TeacherTopicFilter extends PaginationParamsDto {
  @IsOptional()
  majorId: string;
}
