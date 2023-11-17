import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '#entity/user/user.entity';
import { Transform } from 'class-transformer';

export class UpdateUserAdminInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  birthDate: string;

  @IsOptional()
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  startYear: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  finishYear: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  specificAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  province: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  district: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ward: string;
}
