import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileInput {
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  emailVerifyCode?: string;

  @IsOptional()
  @IsNumber()
  verificationTime?: number;
}
