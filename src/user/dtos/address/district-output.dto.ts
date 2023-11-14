import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DistrictOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  level: string;

  @Expose()
  @ApiProperty()
  provinceId: string;
}
