import { ApiProperty } from '@nestjs/swagger';
import {IsDate, IsOptional, IsString} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTopicRegistrationPhaseInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  finishDate: Date;
}
