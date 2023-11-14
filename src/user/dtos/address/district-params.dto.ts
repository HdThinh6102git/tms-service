import { IsNotEmpty, IsString } from 'class-validator';

export class DistrictParamsDto {
  @IsNotEmpty()
  @IsString()
  public provinceId: string;
}
