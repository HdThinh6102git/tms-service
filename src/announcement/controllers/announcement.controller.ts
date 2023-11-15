import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  AnnouncementFilter,
  AnnouncementOutput,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../dtos';

@Controller('announcement')
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createNewAnnouncement(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateAnnouncementInput,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    return await this.announcementService.createNewAnnouncement(
      body,
      ctx.user.id,
    );
  }

  @Patch(':id')
  public async updateAnnouncement(
    @Param('id') announcementId: string,
    @Body() body: UpdateAnnouncementInput,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    return await this.announcementService.updateAnnouncement(
      body,
      announcementId,
    );
  }

  @Get('/filter')
  public async getAnnouncements(
    @Query() query: AnnouncementFilter,
  ): Promise<BasePaginationResponse<AnnouncementOutput>> {
    return this.announcementService.getAnnouncements(query);
  }

  @Get(':id')
  public async getAnnouncementById(
    @Param('id') announcementId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    return await this.announcementService.getAnnouncementById(announcementId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteAnnouncement(
    @Param('id') announcementId: string,
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.announcementService.deleteAnnouncement(
      announcementId,
      ctx.user.id,
    );
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteAnnouncementPermanently(
    @Param('id') announcementId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.announcementService.deleteAnnouncementPermanently(
      announcementId,
    );
  }

  @Patch('restoration/:id')
  public async retoreAnnouncement(
    @Param('id') announcementId: string,
  ): Promise<BaseApiResponse<AnnouncementOutput>> {
    return await this.announcementService.restoreAnnouncement(announcementId);
  }
}
