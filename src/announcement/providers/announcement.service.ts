import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Announcement, ANNOUNCEMENT_STATUS } from '#entity/announcement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  AnnouncementFilter,
  AnnouncementOutput,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../dtos';
import { User } from '#entity/user/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MESSAGES } from '../../shared/constants';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createNewAnnouncement(
    input: CreateAnnouncementInput,
    userId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        data: null,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const announcement = await this.announcementRepo.save({
      ...input,
      userId: userId,
    });
    const announcementOutput = plainToClass(AnnouncementOutput, announcement, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: announcementOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async updateAnnouncement(
    input: UpdateAnnouncementInput,
    announcementId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    const announcementExist = await this.announcementRepo.findOne({
      where: {
        id: announcementId,
        deletedAt: IsNull(),
      },
    });
    if (!announcementExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ANNOUNCEMENT_NOT_FOUND,
        code: 4,
      });
    }
    //check data input to update
    if (input.title) {
      announcementExist.title = input.title;
    }
    if (typeof input.status === 'number') {
      if (input.status == 0) {
        announcementExist.status = ANNOUNCEMENT_STATUS.IN_ACTIVE;
      }
      if (input.status == 1) {
        announcementExist.status = ANNOUNCEMENT_STATUS.ACTIVE;
      }
    }
    if (input.content) {
      announcementExist.content = input.content;
    }
    //save
    const updatedAnnouncement = await this.announcementRepo.save(
      announcementExist,
    );
    //convert to output
    const announcementOutput = plainToClass(
      AnnouncementOutput,
      updatedAnnouncement,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: announcementOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async getAnnouncements(
    filter: AnnouncementFilter,
  ): Promise<BasePaginationResponse<AnnouncementOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.userName) {
      const user = await this.userRepo.findOne({
        where: {
          username: ILike(`%${filter.userName}%`),
        },
      });
      where['userId'] = user?.id;
    }
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          title: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          content: ILike(`%${filter.keyword}%`),
        },
      ];
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const announcements = await this.announcementRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.announcementRepo.count({
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
    });
    const announcementsOutput = plainToInstance(
      AnnouncementOutput,
      announcements,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      listData: announcementsOutput,
      total: count,
    };
  }

  public async getAnnouncementById(
    announcementId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, deletedAt: IsNull() },
    });
    if (!announcement) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ANNOUNCEMENT_NOT_FOUND,
        code: 4,
      });
    }
    const announcementOutput = plainToClass(AnnouncementOutput, announcement, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: announcementOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteAnnouncement(
    announcementId: string,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, deletedAt: IsNull() },
    });
    if (!announcement) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ANNOUNCEMENT_NOT_FOUND,
        code: 4,
      });
    }
    const myAnnouncement = await this.announcementRepo.findOne({
      where: { id: announcementId, deletedAt: IsNull(), userId: userId },
    });
    if (!myAnnouncement) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_DELETE_OTHER_USER_ANNOUNCEMENT,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    announcement.deletedAt = new Date();
    await this.announcementRepo.save(announcement);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async deleteAnnouncementPermanently(
    announcementId: string,
  ): Promise<BaseApiResponse<null>> {
    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, deletedAt: Not(IsNull()) },
    });
    if (!announcement) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ANNOUNCEMENT_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    await this.announcementRepo.delete(announcementId);
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETED_SUCCEED,
      code: 0,
    };
  }

  public async restoreAnnouncement(
    announcementId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, deletedAt: Not(IsNull()) },
    });
    if (!announcement) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.ANNOUNCEMENT_NOT_FOUND_IN_TRASH_BIN,
        code: 4,
      });
    }
    announcement.deletedAt = null;
    const updatedAnnouncement = await this.announcementRepo.save(announcement);
    const announcementOutput = plainToClass(
      AnnouncementOutput,
      updatedAnnouncement,
      {
        excludeExtraneousValues: true,
      },
    );
    return {
      error: false,
      data: announcementOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
