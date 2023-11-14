import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthTokenOutput, VerificationUser } from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/providers';
import bcrypt from 'bcrypt';
import { UserOutputDto } from '../../user/dtos';
import { plainToClass } from 'class-transformer';
import { MESSAGES } from '../../shared/constants';
import { User } from '#entity/user/user.entity';
import { JwtPayload, Payload, RefreshTokenPayload } from '../auth.interface';
import { MailService } from '../../shared/providers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseApiResponse } from '../../shared/dtos';
import { makeId } from '../../shared/utils/utils';
import { Verification } from '#entity/user/verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}
  //common function
  public generateToken(user: UserOutputDto): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken({
        id: user.id,
        username: user.username,
        role: user.role,
      }),
      refreshToken: this.generateRefreshToken({
        sub: user.id,
      }),
    };
  }
  public generateAccessToken(data: Payload): string {
    const payload: JwtPayload = {
      id: data.id,
      username: data.username,
      role: data.role,
    };
    return this.jwt.sign(payload);
  }
  public generateRefreshToken(data: RefreshTokenPayload): string {
    return this.jwt.sign(data);
  }

  //login function

  public async verifyLogin(
    username: string,
    password: string,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    //validate user
    const user = await this.userService.validateUser(username, password);
    //generate token and update refresh token
    const jwt = this.generateToken(user);
    await this.userService.update(user.id, {
      refreshToken: jwt.refreshToken,
    });
    //convert to output
    const output = plainToClass(
      AuthTokenOutput,
      {
        id: user.id,
        token: jwt.accessToken,
        refreshToken: jwt.refreshToken,
      },
      { excludeExtraneousValues: true },
    );
    //return result
    return {
      error: false,
      data: output,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  //forgot password function
  public async verifyCodeForgotPassword(input: VerificationUser) {
    //find user by id
    const user = await this.userRepository.findOne({
      where: {
        id: input.id,
      },
    });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND_USER);
    }
    //check expired verification time
    const latestVerification = await this.verificationRepository.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
    if (
      latestVerification &&
      latestVerification.verificationTime &&
      Date.now() > latestVerification.verificationTime
    ) {
      throw new NotFoundException(MESSAGES.VERIFICATION_EXPIRED);
    }
    //compare verification code
    if (
      latestVerification &&
      latestVerification.verificationCode.toUpperCase() !==
        input.verificationCode.toUpperCase()
    ) {
      throw new NotFoundException(MESSAGES.VERIFICATION_INCORRECT);
    }
    //generate new password
    const password = makeId(10);
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await this.userRepository.update({ id: user.id }, { password: hash });
    //send mail after verified
    const sendingMail =
      await this.mailService.sendMailForgotPasswordAfterVerified(
        user,
        password,
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
      data: null,
      message: MESSAGES.SEND_MAIL_SUCCESSFULLY,
      code: 0,
    };
  }
}
