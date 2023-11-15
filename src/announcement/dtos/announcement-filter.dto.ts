import { IsEnum, IsOptional } from 'class-validator';
import { ANNOUNCEMENT_STATUS } from '#entity/announcement.entity';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from '../../shared/dtos';

export class AnnouncementFilter extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(ANNOUNCEMENT_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: ANNOUNCEMENT_STATUS;

  @IsOptional()
  keyword: string;

  @IsOptional()
  userName: string;
}
