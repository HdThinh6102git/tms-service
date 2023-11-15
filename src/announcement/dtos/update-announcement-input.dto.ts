import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ANNOUNCEMENT_STATUS } from '#entity/announcement.entity';

export class UpdateAnnouncementInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ANNOUNCEMENT_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: ANNOUNCEMENT_STATUS;
}
