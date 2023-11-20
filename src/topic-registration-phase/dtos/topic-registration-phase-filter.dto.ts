import { PaginationParamsDto } from '../../shared/dtos';
import {IsDate, IsOptional} from 'class-validator';
import { Type} from 'class-transformer';

export class TopicRegistrationPhaseFilter extends PaginationParamsDto {
  @IsOptional()
  keyword: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finishDate: Date;
}
