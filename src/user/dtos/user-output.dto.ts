import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleOutput } from '../../auth/dtos/role-output.dto';
import { ClassOutput } from '../../class/dtos';

export class UserOutputDto {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public username: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public fullAddress: string;

  @Expose()
  @ApiProperty()
  public specificAddress: string;

  @Expose()
  @ApiProperty()
  public birthDate: string;

  @Expose()
  @ApiProperty()
  public phoneNumber: string;

  @Expose()
  @ApiProperty()
  public email: string;

  @Expose()
  @ApiProperty()
  @Type(() => Number)
  public status: number;

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
  public updatedAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => RoleOutput)
  role: RoleOutput;

  @Expose()
  @ApiProperty()
  @Type(() => ClassOutput)
  clas: ClassOutput;
}
