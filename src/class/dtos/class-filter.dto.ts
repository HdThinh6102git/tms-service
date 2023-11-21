import { PaginationParamsDto } from '../../shared/dtos';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClassFilter extends PaginationParamsDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  startYear: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  finishYear: number;
}
