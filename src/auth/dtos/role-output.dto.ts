import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionOutput } from './permission-output.dto';

export class RoleOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  @Type(() => PermissionOutput)
  permissions: PermissionOutput[];
}
