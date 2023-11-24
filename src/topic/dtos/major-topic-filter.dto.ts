import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class MajorTopicFilter extends PaginationParamsDto {
  @IsOptional()
  name: string;
}
