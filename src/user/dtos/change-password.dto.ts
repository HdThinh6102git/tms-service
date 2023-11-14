import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
