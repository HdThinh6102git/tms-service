import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TopicOutput } from './topic-output.dto';

export class TeacherTopicOutput extends TopicOutput {
  @Expose()
  @ApiProperty()
  public isYourRegistration: boolean;

  @Expose()
  @ApiProperty()
  public topicRegistrationId: string | null;
}
