import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateTopicRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsIn([2, 3])
  status: number;
}
