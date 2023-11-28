import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Role } from '#entity/user/role.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MESSAGES } from '../../shared/constants';

import {
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserAdminInput,
  UpdateUserInput,
  UserFilter,
  UserOutputDto,
  UserProfileOutput,
} from '../dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { isValidEmail } from '../../shared/utils/utils';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { ROLE } from '../../auth/constants';
import { Class } from '#entity/class.entity';
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
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  public async createUser(
    data: CreateUserInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    //check valid email
    if (!isValidEmail(data.email)) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.WRONG_EMAIL_FORMAT,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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

    //hash password
    const hash = bcrypt.hashSync(
      data.password,
      this.config.get('saltRounds') || 7,
    );
    // set role user
    const userRole = await this.roleRepository.findOneBy({
      name: data.role,
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
    let classExist;
    if (userRole.name == ROLE.STUDENT) {
      if (!data.startYear || !data.finishYear) {
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.START_AND_FINISH_YEAR_ARE_REQUIRED,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!data.classId) {
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.CLASS_IS_REQUIRED,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      //check exist class
      classExist = await this.classRepository.findOne({
        where: {
          id: data.classId,
        },
      });
      if (!classExist) {
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.CLASS_NOT_EXIST,
            code: 1,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (userRole.name == ROLE.TEACHER) {
      if (data.startYear || data.finishYear) {
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.START_AND_FINISH_YEAR_ARE_NOT_ALLOWED,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data.classId) {
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.CLASS_IS_NOT_ALLOWED,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    //save user data
    const user = await this.userRepository.save({
      ...data,
      password: hash,
      role: userRole,
      clas: classExist,
    });
    const userOutput = plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async update(
    id: string,
    data: UpdateProfileInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['role', 'clas'],
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

  public async findUserByEmailOrPhoneorUsername(
    username: string,
  ): Promise<User> {
    const user: any = await this.userRepository.findOne({
      where: [
        { phoneNumber: username },
        { email: ILike(username) },
        { username: username },
      ],
      relations: ['role', 'clas'],
    });
    return user;
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<UserOutputDto> {
    // find user by email or phone
    const user = await this.findUserByEmailOrPhoneorUsername(username);
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
      relations: ['role', 'clas'],
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

  public async getUsers(
    filter: UserFilter,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.role) {
      where['role'] = { id: filter.role };
    }
    if (filter.province) {
      where['province'] = { id: filter.province };
    }
    if (filter.district) {
      where['district'] = { id: filter.district };
    }
    if (filter.ward) {
      where['ward'] = { id: filter.ward };
    }
    if (filter.classId) {
      const clas = await this.classRepository.findOne({
        where: { id: filter.classId },
      });
      if (clas) {
        where['clas'] = { id: filter.classId };
      }
    }
    if (typeof filter.startYear == 'number') {
      where['startYear'] = filter.startYear;
    }
    if (typeof filter.finishYear == 'number') {
      where['finishYear'] = filter.finishYear;
    }
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          username: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          name: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          email: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          phoneNumber: ILike(`%${filter.keyword}%`),
        },
      ];
      const clas = await this.classRepository.findOne({
        where: { name: ILike(`%${filter.keyword}%`) },
      });
      if (clas) {
        const whereClas: any = {
          ...where,
          clas: { id: clas.id },
        };
        wheres.push(whereClas);
      }
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const users = await this.userRepository.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['role', 'clas'],
    });
    const count = await this.userRepository.count({
      where: wheres,
    });
    const usersOutput = plainToInstance(UserOutputDto, users, {
      excludeExtraneousValues: true,
    });
    return {
      listData: usersOutput,
      total: count,
    };
  }

  public async updateProfile(
    input: UpdateUserInput,
    userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    const userExist = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['role', 'clas'],
    });
    if (!userExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    if (input.phoneNumber) {
      userExist.phoneNumber = input.phoneNumber;
    }
    if (input.specificAddress) {
      userExist.specificAddress = input.specificAddress;
    }
    if (input.province && input.district && input.ward) {
      const province = await this.provinceRepository.findOne({
        where: { id: input.province },
      });
      const district = await this.districtRepository.findOne({
        where: { id: input.district },
      });
      const ward = await this.wardRepository.findOne({
        where: { id: input.ward },
      });
      if (province && district && ward) {
        userExist.province = province;
        userExist.district = district;
        userExist.ward = ward;
        //set full address
        userExist.fullAddress = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    }

    const updatedUser = await this.userRepository.save(userExist);
    const userOutput = plainToClass(UserProfileOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async updateUser(
    input: UpdateUserAdminInput,
    userId: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const userExist = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['role', 'clas'],
    });
    if (!userExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    if (input.password) {
      const hash = bcrypt.hashSync(
        input.password,
        this.config.get('saltRounds') || 7,
      );
      userExist.password = hash;
    }
    if (input.startYear) {
      if (userExist.role.name == ROLE.STUDENT) {
        userExist.startYear = input.startYear;
      }
    }
    if (input.finishYear) {
      if (userExist.role.name == ROLE.STUDENT) {
        userExist.finishYear = input.finishYear;
      }
    }
    if (input.birthDate) {
      userExist.birthDate = input.birthDate;
    }
    if (typeof input.status == 'number') {
      userExist.status = input.status;
    }
    if (input.name) {
      userExist.name = input.name;
    }
    if (input.phoneNumber) {
      userExist.phoneNumber = input.phoneNumber;
    }
    if (input.email) {
      userExist.email = input.email;
    }
    if (input.specificAddress) {
      userExist.specificAddress = input.specificAddress;
    }
    if (input.province && input.district && input.ward) {
      const province = await this.provinceRepository.findOne({
        where: { id: input.province },
      });
      const district = await this.districtRepository.findOne({
        where: { id: input.district },
      });
      const ward = await this.wardRepository.findOne({
        where: { id: input.ward },
      });
      if (province && district && ward) {
        userExist.province = province;
        userExist.district = district;
        userExist.ward = ward;
        //set full address
        userExist.fullAddress = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    }
    if (input.classId) {
      //check exist class
      const clas = await this.classRepository.findOne({
        where: {
          id: input.classId,
        },
      });
      if (clas) {
        if (userExist.role.name == ROLE.STUDENT) {
          userExist.clas = clas;
        }
      }
    }
    const updatedUser = await this.userRepository.save(userExist);
    const userOutput = plainToClass(UserOutputDto, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteUser(userId: string): Promise<BaseApiResponse<null>> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteUserPermanently(
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: Not(IsNull()) },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.USER_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.userRepository.delete(userId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreUser(
    userId: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: Not(IsNull()) },
      relations: ['role', 'clas'],
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.USER_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    user.deletedAt = null;
    const updatedUser = await this.userRepository.save(user);
    const userOutput = plainToClass(UserOutputDto, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
