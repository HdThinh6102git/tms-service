import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class EvaluateTeacherTopicRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsIn([2, 3])
  status: number;

  @ApiProperty()
  @IsOptional()
  reviewTeacher: string;
}
