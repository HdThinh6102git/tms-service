import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateClassInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

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

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  majorId: string;
}
