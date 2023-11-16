import { PaginationParamsDto } from '../../../shared/dtos';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserFilter extends PaginationParamsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  role: number;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  keyword: string;
}
