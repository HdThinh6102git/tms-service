import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MAIL_TEMPLATE, MESSAGES, VERIFICATION_TIME } from '../constants';
import { User } from '#entity/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { convertMilliseconds, generateCode } from '../../user/utils/user.utils';
import {
  Verification,
  VERIFICATION_TYPE,
} from '#entity/user/verification.entity';
import { BaseApiResponse } from '../dtos';
import { Admin } from '#entity/user/admin.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}
  //common send mail
  public async sendMail(
    sendTo: string,
    subject: string,
    context: any,
    template: string,
  ) {
    try {
      if (process.env['EMAIL_ACCOUNT'] && process.env['EMAIL_FROM']) {
        return this.mailerService.sendMail({
          to: sendTo,
          from: {
            address: process.env['EMAIL_ACCOUNT'],
            name: process.env['EMAIL_FROM'],
          },
          subject: subject,
          template: template,
          context: context,
        });
      }
    } catch (e) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ACTION_NOT_PERFORMED,
          code: 0,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //send mail forgot password
  public async sendForgotPasswordVerificationMail(email: string) {
    //find user by email
    const user: any = await this.userRepository.findOne({
      where: { email: ILike(email) },
    });
    if (!user) {
      throw new ForbiddenException(MESSAGES.EMAIL_NOT_FOUND);
    }
    //check verification time to prevent spam
    const latestVerification: any = await this.verificationRepository.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
    if (
      latestVerification &&
      Date.now() <= latestVerification.verificationTime
    ) {
      throw new BadRequestException(MESSAGES.VERIFICATION_CODE_NOT_EXPIRED);
    }
    //create new verification
    const emailVerificationCode = generateCode();
    const verificationTime: number =
      Date.now() + convertMilliseconds(VERIFICATION_TIME);
    const verification = await this.verificationRepository.save({
      userId: user.id,
      verificationCode: emailVerificationCode,
      verificationTime: verificationTime,
      type: VERIFICATION_TYPE.FORGOT_PASSWORD,
    });
    //send verification email
    const subject = 'Oron website - Xác thực tài khoản';
    const context = {
      name: user.name,
      emailVerifyCode: verification.verificationCode,
    };
    const sendingMail = await this.sendMail(
      user.email,
      subject,
      context,
      MAIL_TEMPLATE.VERIFY_FORGOT_EMAIL_TEMPLATE,
    );
    if (sendingMail.error)
      throw new HttpException(
        {
          message: sendingMail.data,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //return output
    return {
      error: false,
      data: { userId: user.id },
      message: MESSAGES.SEND_MAIL_SUCCESSFULLY,
      code: 0,
    };
  }

  public async sendMailForgotPasswordAfterVerified(
    user: User,
    password: string,
  ): Promise<BaseApiResponse<null>> {
    const subject = 'Oron website - Forgot password';
    const context = {
      shopOwnerName: user.name,
      password: password,
    };
    return this.sendMail(
      user.email,
      subject,
      context,
      MAIL_TEMPLATE.FORGOT_PASSWORD_TEMPLATE,
    );
  }

  public async sendMailForgotPasswordAdmin(
    admin: Admin,
    password: string,
  ): Promise<BaseApiResponse<null>> {
    const subject = 'Oron website - Forgot password';
    const context = {
      shopOwnerName: admin.email,
      password: password,
    };
    return this.sendMail(
      admin.email,
      subject,
      context,
      MAIL_TEMPLATE.FORGOT_PASSWORD_TEMPLATE,
    );
  }
}
