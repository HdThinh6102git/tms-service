import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserInput {
  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsOptional()
  startYear: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsOptional()
  finishYear: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  classId: string;
}
