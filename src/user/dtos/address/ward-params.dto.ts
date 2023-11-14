import { IsNotEmpty, IsString } from 'class-validator';

export class WardParamsDto {
  @IsNotEmpty()
  @IsString()
  public districtId: string;
}
