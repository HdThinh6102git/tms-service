import { PaginationParamsDto } from '../../shared/dtos';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TOPIC_STATUS } from '#entity/topic.entity';

export class TopicFilter extends PaginationParamsDto {
  @IsOptional()
  keyword: string;

  @IsOptional()
  userKeyword: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finishDate: Date;

  @IsOptional()
  @IsEnum(TOPIC_STATUS)
  @Transform(({ value }) => (value ? Number(value) : null))
  status: TOPIC_STATUS;
}
