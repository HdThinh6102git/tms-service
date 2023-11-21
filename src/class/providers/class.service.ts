import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from '#entity/major.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Admin } from '#entity/user/admin.entity';
import { Class } from '#entity/class.entity';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  ClassFilter,
  ClassOutput,
  CreateClassInput,
  UpdateClassInput,
} from '../dtos';
import { MESSAGES } from '../../shared/constants';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Major)
    private majorRepo: Repository<Major>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(Class)
    private classRepo: Repository<Class>,
  ) {}

  public async createClass(
    input: CreateClassInput,
    adminId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
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
    const major = await this.majorRepo.findOne({
      where: {
        id: input.majorId,
      },
    });
    if (!major) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.MAJOR_NOT_FOUND,
        code: 4,
      });
    }
    const clasNameExist = await this.classRepo.findOne({
      where: {
        name: input.name,
      },
    });
    if (clasNameExist) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CLASS_NAME_EXIST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clas = await this.classRepo.save({
      ...input,
      admin: admin,
      major: major,
    });
    const classOutput = plainToClass(ClassOutput, clas, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: classOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateClass(
    input: UpdateClassInput,
    classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    const classExist = await this.classRepo.findOne({
      where: {
        id: classId,
      },
      relations: ['admin', 'major'],
    });
    if (!classExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLASS_NOT_FOUND,
        code: 4,
      });
    }
    if (input.name) {
      const clasNameExist = await this.classRepo.findOne({
        where: {
          name: input.name,
        },
      });
      if (clasNameExist) {
        throw new HttpException(
          {
            error: true,
            message: MESSAGES.CLASS_NAME_EXIST,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      classExist.name = input.name;
    }
    if (input.startYear) {
      classExist.startYear = input.startYear;
    }
    if (input.finishYear) {
      classExist.finishYear = input.finishYear;
    }
    const updatedClass = await this.classRepo.save(classExist);
    const classOutput = plainToClass(ClassOutput, updatedClass, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: classOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getClasses(
    filter: ClassFilter,
  ): Promise<BasePaginationResponse<ClassOutput>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    if (typeof filter.startYear == 'number') {
      where['startYear'] = filter.startYear;
    }
    if (typeof filter.finishYear == 'number') {
      where['finishYear'] = filter.finishYear;
    }
    const classes = await this.classRepo.find({
      where: where,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['admin', 'major'],
    });
    const count = await this.classRepo.count({
      where: where,
    });
    const classesOutput = plainToInstance(ClassOutput, classes, {
      excludeExtraneousValues: true,
    });
    return {
      listData: classesOutput,
      total: count,
    };
  }

  public async getClassById(
    classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    const clas = await this.classRepo.findOne({
      where: { id: classId, deletedAt: IsNull() },
      relations: ['admin', 'major'],
    });
    if (!clas) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLASS_NOT_FOUND,
        code: 4,
      });
    }
    const classOutput = plainToClass(ClassOutput, clas, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: classOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteClass(classId: string): Promise<BaseApiResponse<null>> {
    const clas = await this.classRepo.findOne({
      where: { id: classId, deletedAt: IsNull() },
    });
    if (!clas) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLASS_NOT_FOUND,
        code: 4,
      });
    }
    clas.deletedAt = new Date();
    await this.classRepo.save(clas);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteClassPermanently(
    classId: string,
  ): Promise<BaseApiResponse<null>> {
    const clas = await this.classRepo.findOne({
      where: { id: classId, deletedAt: Not(IsNull()) },
    });
    if (!clas) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLASS_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.classRepo.delete(classId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreClass(
    classId: string,
  ): Promise<BaseApiResponse<ClassOutput>> {
    const clas = await this.classRepo.findOne({
      where: { id: classId, deletedAt: Not(IsNull()) },
    });
    if (!clas) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLASS_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    clas.deletedAt = null;
    const updatedClass = await this.classRepo.save(clas);
    const classOutput = plainToClass(ClassOutput, updatedClass, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: classOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
