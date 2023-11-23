import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from '../../user/dtos';
import { TopicOutput } from '../../topic/dtos';

export class TopicRegistrationOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public message: string;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public status: number;

  @Expose()
  @ApiProperty()
  public type: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @Expose()
  @ApiProperty()
  @Type(() => TopicOutput)
  topic: TopicOutput;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public updatedAt: Date;
}
