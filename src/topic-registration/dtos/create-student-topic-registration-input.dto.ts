import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStudentTopicRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  message: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  topicId: string;
}
