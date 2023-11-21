import { PaginationParamsDto } from '../../shared/dtos';
import { IsOptional } from 'class-validator';

export class MajorFilter extends PaginationParamsDto {
  @IsOptional()
  name: string;
}
