import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTopicInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  majorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  detail: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  finishDate: Date;

  @ApiProperty()
  reviewTeacher: string;
}
