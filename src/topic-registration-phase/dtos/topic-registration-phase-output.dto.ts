import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminOutput } from '../../user/dtos';

export class TopicRegistrationPhaseOutput {
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
  public startDate: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public finishDate: Date;

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
  @Type(() => AdminOutput)
  admin: AdminOutput;
}
