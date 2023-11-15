import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { ILike, Repository } from 'typeorm';
import { Role } from '#entity/user/role.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterInput } from '../../auth/dtos';
import * as bcrypt from 'bcrypt';
import { MESSAGES } from '../../shared/constants';

import { UpdateProfileInput, UserOutputDto, UserProfileOutput } from '../dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { ROLE } from '../../auth/constants';
import { BaseApiResponse } from '../../shared/dtos';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private config: ConfigService,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}

  public async create(data: RegisterInput): Promise<User> {
    //check exist province
    const provinceExist = await this.provinceRepository.findOne({
      where: {
        id: data.province,
      },
    });
    if (!provinceExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.PROVINCE_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check exist district
    const districtExist = await this.districtRepository.findOne({
      where: {
        id: data.district,
      },
    });
    if (!districtExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.DISTRICT_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check exist ward
    const wardExist = await this.wardRepository.findOne({
      where: {
        id: data.ward,
      },
    });
    if (!wardExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.WARD_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check phone exist
    const userWithPhoneExist = await this.userRepository.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    if (userWithPhoneExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.PHONE_NUMBER_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //check email exist
    const userWithEmailExist = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });
    if (userWithEmailExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.EMAIL_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //check user name exist
    const userWithUsernameExist = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });
    if (userWithUsernameExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.USER_NAME_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //set full address
    const fullAddress = `${wardExist.level} ${wardExist.name}, ${districtExist.level} ${districtExist.name}, ${provinceExist.level} ${provinceExist.name}`;
    //hash password
    const hash = bcrypt.hashSync(
      data.password,
      this.config.get('saltRounds') || 7,
    );
    // set role user
    const userRole = await this.roleRepository.findOneBy({
      name: ROLE.USER,
    });
    if (!userRole)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ROLE_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //save user data
    return this.userRepository.save({
      ...data,
      province: provinceExist,
      district: districtExist,
      ward: wardExist,
      password: hash,
      role: userRole,
      fullAddress: fullAddress,
    });
  }

  public async update(
    id: string,
    data: UpdateProfileInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );

    const newData = {
      ...user,
      ...data,
    };

    const updated = await this.userRepository.save(newData);

    const result = plainToInstance(UserOutputDto, updated, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async findUserByEmailOrPhone(username: string): Promise<User> {
    const user: any = await this.userRepository.findOne({
      where: [{ phoneNumber: username }, { email: ILike(username) }],
    });
    return user;
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<UserOutputDto> {
    // find user by email or phone
    const user = await this.findUserByEmailOrPhone(username);
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(password, user.password);
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
    // return user output
    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async getMyProfile(
    userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    const output = plainToClass(UserProfileOutput, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: output,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<BaseApiResponse<null>> {
    //find user by id
    const existUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existUser)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(oldPassword, existUser.password);
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
    await this.userRepository.update({ id: userId }, { password: hash });
    //return
    return {
      error: false,
      data: null,
      code: 0,
      message: MESSAGES.UPDATE_SUCCEED,
    };
  }
}
