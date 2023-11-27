import { PaginationParamsDto } from '../../shared/dtos';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ASSIGNMENT_STATUS } from '#entity/assignment.entity';

export class AssignmentFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(ASSIGNMENT_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: ASSIGNMENT_STATUS;

  @IsOptional()
  keyword: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finishAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  score: number;

  @IsOptional()
  @IsString()
  topicId: string;
}
