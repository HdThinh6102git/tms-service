import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
  status: ANNOUNCEMENT_STATUS;
}
