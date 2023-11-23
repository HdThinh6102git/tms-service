import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TOPIC_REGISTRATION_STATUS } from '#entity/topic-registration.entity';

export class UpdateTopicRegistrationInput {
  @ApiProperty()
  @IsOptional()
  @IsEnum(TOPIC_REGISTRATION_STATUS)
  status: number;
}
