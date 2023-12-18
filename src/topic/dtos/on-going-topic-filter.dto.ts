import { PaginationParamsDto } from '../../shared/dtos';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OnGoingTopicFilter extends PaginationParamsDto {
  @IsOptional()
  teacherId: string;

  @IsOptional()
  studentProjectId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finishDate: Date;

  @IsOptional()
  keyword: string;
}
