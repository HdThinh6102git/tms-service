import { TopicOutput } from './topic-output.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MajorHeadTopicOutput extends TopicOutput {
  @Expose()
  @ApiProperty()
  public topicRegistrationId: string | null;
}
