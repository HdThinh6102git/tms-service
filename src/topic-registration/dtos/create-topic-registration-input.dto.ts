import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  message: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  topicId: string;

  @IsOptional()
  @ApiProperty()
  firstStudentEmail: string;

  @IsOptional()
  @ApiProperty()
  secondStudentEmail: string;
}
