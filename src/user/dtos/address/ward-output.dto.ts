import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WardOutput {
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
  districtId: string;
}
