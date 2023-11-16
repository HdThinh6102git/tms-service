import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AdminOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public username: string;

  @Expose()
  @ApiProperty()
  public email: string;
}
