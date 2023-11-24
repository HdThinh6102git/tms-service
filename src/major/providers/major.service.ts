import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Admin } from '#entity/user/admin.entity';
import { Major } from '#entity/major.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateMajorInput,
  MajorDropDownOutput,
  MajorFilter,
  MajorOutput,
  UpdateMajorInput,
} from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Major)
    private majorRepo: Repository<Major>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  public async createMajor(
    input: CreateMajorInput,
    adminId: string,
  ): Promise<BaseApiResponse<MajorOutput>> {
    const admin = await this.adminRepo.findOne({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.ADMIN_NOT_FOUND,
        code: 4,
      });
    }
    const majorNameExist = await this.majorRepo.findOne({
      where: {
        name: input.name,
      },
    });
    if (majorNameExist) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.MAJOR_NAME_EXIST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const major = await this.majorRepo.save({
      ...input,
      admin: admin,
    });
    const majorOutput = plainToClass(MajorOutput, major, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: majorOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateMajor(
    input: UpdateMajorInput,
    majorId: string,
  ): Promise<BaseApiResponse<MajorOutput>> {
    const majorExist = await this.majorRepo.findOne({
      where: {
        id: majorId,
      },
      relations: ['admin'],
    });
    if (!majorExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.MAJOR_NOT_FOUND,
        code: 4,
      });
    }
    if (input.name) {
      const majorNameExist = await this.majorRepo.findOne({
        where: {
          name: input.name,
        },
      });
      if (majorNameExist) {
        throw new HttpException(
          {
            error: true,
            message: MESSAGES.MAJOR_NAME_EXIST,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      majorExist.name = input.name;
    }
    const updatedMajor = await this.majorRepo.save(majorExist);
    const majorOutput = plainToClass(MajorOutput, updatedMajor, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: majorOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getMajors(
    filter: MajorFilter,
  ): Promise<BasePaginationResponse<MajorOutput>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    const majors = await this.majorRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['admin'],
    });
    const count = await this.majorRepo.count({
      where: where,
    });
    const majorsOutput = plainToInstance(MajorOutput, majors, {
      excludeExtraneousValues: true,
    });
    return {
      listData: majorsOutput,
      total: count,
    };
  }

  public async getDropdownMajors(
    filter: MajorFilter,
  ): Promise<BasePaginationResponse<MajorDropDownOutput>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    const majors = await this.majorRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.majorRepo.count({
      where: where,
    });
    const majorsOutput = plainToInstance(MajorDropDownOutput, majors, {
      excludeExtraneousValues: true,
    });
    return {
      listData: majorsOutput,
      total: count,
    };
  }

  public async deleteMajor(majorId: string): Promise<BaseApiResponse<null>> {
    const major = await this.majorRepo.findOne({
      where: { id: majorId, deletedAt: IsNull() },
    });
    if (!major) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.MAJOR_NOT_FOUND,
        code: 4,
      });
    }
    major.deletedAt = new Date();
    await this.majorRepo.save(major);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteMajorPermanently(
    majorId: string,
  ): Promise<BaseApiResponse<null>> {
    const major = await this.majorRepo.findOne({
      where: { id: majorId, deletedAt: Not(IsNull()) },
    });
    if (!major) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.MAJOR_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.majorRepo.delete(majorId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreMajor(
    majorId: string,
  ): Promise<BaseApiResponse<MajorOutput>> {
    const major = await this.majorRepo.findOne({
      where: { id: majorId, deletedAt: Not(IsNull()) },
    });
    if (!major) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.MAJOR_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    major.deletedAt = null;
    const updatedMajor = await this.majorRepo.save(major);
    const majorOutput = plainToClass(MajorOutput, updatedMajor, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: majorOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
