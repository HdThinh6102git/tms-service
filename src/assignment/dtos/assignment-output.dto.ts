import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TopicOutput } from '../../topic/dtos';

export class AssignmentOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public title: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public startAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public finishAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public status: number;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public score: number;

  @Expose()
  @ApiProperty()
  public resultFile: string;

  @Expose()
  @ApiProperty()
  public resultText: string;

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
}
