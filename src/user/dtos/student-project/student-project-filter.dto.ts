import { PaginationParamsDto } from '../../../shared/dtos';
import { IsOptional } from 'class-validator';

export class StudentProjectFilter extends PaginationParamsDto {
  @IsOptional()
  topicId: string;
}
