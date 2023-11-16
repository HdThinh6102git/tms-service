import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
