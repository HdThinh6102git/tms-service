import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminOutput } from '../../user/dtos';
import { MajorOutput } from '../../major/dtos';

export class ClassOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public startYear: number;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public finishYear: number;

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
