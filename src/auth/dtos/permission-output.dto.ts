import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  permissionName: string;
}
