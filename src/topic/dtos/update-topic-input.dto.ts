import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTopicInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detail: string;

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

  @ApiProperty()
  @IsOptional()
  reviewTeacher: string;
}
