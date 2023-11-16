import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Admin } from '#entity/user/admin.entity';
import { BaseApiResponse } from '../../../shared/dtos';
import { AdminOutput, CreateAdminInput } from '../../dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MESSAGES } from '../../../shared/constants';
import { MailService } from '../../../shared/providers';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { makeId } from '../../../shared/utils/utils';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  public async createNewAdmin(
    input: CreateAdminInput,
  ): Promise<BaseApiResponse<AdminOutput>> {
    //check user name exist
    const adminWithUsernameExist = await this.adminRepo.findOne({
      where: {
        username: input.username,
      },
    });
    if (adminWithUsernameExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.USER_NAME_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //hash password
    const hash = bcrypt.hashSync(
      input.password,
      this.config.get('saltRounds') || 7,
    );
    const admin = await this.adminRepo.save({
      ...input,
      password: hash,
    });
    const adminOutput = plainToClass(AdminOutput, admin, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: adminOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async changePassword(
    adminId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<BaseApiResponse<null>> {
    //find user by id
    const existAdmin = await this.adminRepo.findOne({
      where: { id: adminId },
    });
    if (!existAdmin)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ADMIN_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(oldPassword, existAdmin.password);
    if (!match)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.INCORRECT_PASSWORD,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //hash new password
    const hash = bcrypt.hashSync(
      newPassword,
      this.config.get('saltRounds') || 7,
    );
    //update password
    await this.adminRepo.update({ id: adminId }, { password: hash });
    return {
      error: false,
      data: null,
      code: 0,
      message: MESSAGES.UPDATE_SUCCEED,
    };
  }

  public async forgotPassword(email: string): Promise<BaseApiResponse<null>> {
    const admin: any = await this.adminRepo.findOne({
      where: { email: ILike(email) },
    });
    const password = makeId(10);
    const hash = await bcrypt.hash(password, 10);
    admin.password = hash;
    await this.adminRepo.update({ id: admin.id }, { password: hash });
    const sendingMail = await this.mailService.sendMailForgotPasswordAdmin(
      admin,
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

  public async validateAdmin(
    username: string,
    password: string,
  ): Promise<AdminOutput> {
    const admin: any = await this.adminRepo.findOne({
      where: { username: ILike(username) },
    });
    if (!admin)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ADMIN_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.INCORRECT_PASSWORD,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    return plainToInstance(AdminOutput, admin, {
      excludeExtraneousValues: true,
    });
  }
}
