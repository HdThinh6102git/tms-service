import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMajorInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
