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
import { AdminService, UserService } from '../../providers';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  AdminOutput,
  ChangePasswordDto,
  CreateAdminInput,
  CreateUserInput,
  UpdateUserAdminInput,
  UserFilter,
  UserOutputDto,
  UserProfileOutput,
} from '../../dtos';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post()
  public async createNewAdmin(
    @Body() body: CreateAdminInput,
  ): Promise<BaseApiResponse<AdminOutput>> {
    return await this.adminService.createNewAdmin(body);
  }

  //user

  @Post('user')
  @UseGuards(JwtAuthGuard)
  public async createNewUser(
    @Body() body: CreateUserInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return await this.userService.createUser(body);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  public async getUsers(
    @Query() query: UserFilter,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    return this.userService.getUsers(query);
  }

  @Patch('user/:id')
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateUserAdminInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return await this.userService.updateUser(body, userId);
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  public async getUserById(
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return await this.userService.getMyProfile(userId);
  }

  @Delete('user/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteUser(
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.deleteUser(userId);
  }

  @Delete('user/permanently/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteUserPermanently(
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.deleteUserPermanently(userId);
  }

  @Patch('user/restoration/:id')
  public async restoreUser(
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return await this.userService.restoreUser(userId);
  }

  //admin

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  public async changePassword(
    @ReqContext() ctx: RequestContext,
    @Body() input: ChangePasswordDto,
  ): Promise<BaseApiResponse<null>> {
    return this.adminService.changePassword(
      ctx.user.id,
      input.oldPassword,
      input.newPassword,
    );
  }

  @Post('forgot-password')
  public async forgotPassword(
    @Body() body: { email: string },
  ): Promise<BaseApiResponse<null>> {
    return this.adminService.forgotPassword(body.email);
  }
}
