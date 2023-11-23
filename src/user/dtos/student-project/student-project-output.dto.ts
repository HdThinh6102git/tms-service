import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TopicOutput } from '../../../topic/dtos';
import { TopicRegistrationOutput } from '../../../topic-registration/dtos';
import { UserOutputDto } from '../user-output.dto';

export class StudentProjectOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public role: string;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public updatedAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => TopicOutput)
  topic: TopicOutput;

  @Expose()
  @ApiProperty()
  @Type(() => TopicRegistrationOutput)
  topicRegistration: TopicRegistrationOutput;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  studentInfor: UserOutputDto;
}
