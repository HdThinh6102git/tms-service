import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerificationUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}
