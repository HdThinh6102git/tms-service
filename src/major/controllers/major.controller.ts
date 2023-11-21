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
import { MajorService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CreateMajorInput,
  MajorFilter,
  MajorOutput,
  UpdateMajorInput,
} from '../dtos';

@Controller('major')
export class MajorController {
  constructor(private majorService: MajorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createMajor(
    @ReqContext() ctx: RequestContext,
    @Body() body: CreateMajorInput,
  ): Promise<BaseApiResponse<MajorOutput>> {
    return await this.majorService.createMajor(body, ctx.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateMajor(
    @Param('id') majorId: string,
    @Body() body: UpdateMajorInput,
  ): Promise<BaseApiResponse<MajorOutput>> {
    return await this.majorService.updateMajor(body, majorId);
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  public async getMajors(
    @Query() query: MajorFilter,
  ): Promise<BasePaginationResponse<MajorOutput>> {
    return this.majorService.getMajors(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteMajor(
    @Param('id') majorId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.majorService.deleteMajor(majorId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteMajorPermanently(
    @Param('id') majorId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.majorService.deleteMajorPermanently(majorId);
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAuthGuard)
  public async retoreMajor(
    @Param('id') majorId: string,
  ): Promise<BaseApiResponse<MajorOutput>> {
    return await this.majorService.restoreMajor(majorId);
  }
}
