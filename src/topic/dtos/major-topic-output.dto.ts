import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MajorTopicOutput {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public name: string;
}
