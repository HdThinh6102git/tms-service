import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;
}
