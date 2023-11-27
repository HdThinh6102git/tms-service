import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ASSIGNMENT_STATUS } from '#entity/assignment.entity';

export class UpdateAssignmentInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  startAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  finishAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ASSIGNMENT_STATUS)
  status: ASSIGNMENT_STATUS;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  resultText: string;
}
