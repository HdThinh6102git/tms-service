import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ASSIGNMENT_STATUS } from '#entity/assignment.entity';

export class CreateAssignmentInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  finishAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ASSIGNMENT_STATUS)
  status: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  topicId: string;
}
