import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminOutput, UserOutputDto } from '../../user/dtos';
import { MajorOutput } from '../../major/dtos';

export class TopicOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public detail: string;

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
  @Type(() => UserOutputDto)
  public reviewTeacher: UserOutputDto | null;

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

  @Expose()
  @ApiProperty()
  @Type(() => MajorOutput)
  major: MajorOutput;
}
