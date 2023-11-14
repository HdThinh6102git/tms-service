import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ResendMailDto {
  @Expose()
  @IsUUID()
  userId: string;
}
