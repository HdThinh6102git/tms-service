import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../providers';
import { AuthTokenOutput, LoginInput, VerificationUser } from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { MailService } from '../../shared/providers';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  //login

  @Post('login')
  public async login(
    @Body() body: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    return this.authService.verifyLogin(body.username, body.password);
  }

  //forgot password

  @Post('sending-forgot-password-mail')
  public async sendForgotPasswordVerificationMail(
    @Body() body: { email: string },
  ) {
    return this.mailService.sendForgotPasswordVerificationMail(body.email);
  }

  @Post('verification-forgot-password-code')
  public async verifyCodeForgotPassword(@Body() input: VerificationUser) {
    return this.authService.verifyCodeForgotPassword(input);
  }
}
