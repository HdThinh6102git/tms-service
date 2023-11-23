import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentProjectInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  topicId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  topicRegistrationId: string;
}
