import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterInput {
  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ward: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  specificAddress: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  email: string;
}
