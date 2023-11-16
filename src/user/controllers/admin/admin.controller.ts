import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService, UserService } from '../../providers';
import { JwtAuthGuard } from '../../../auth/guards';
import { ReqContext, RequestContext } from '../../../shared/request-context';
import { BaseApiResponse } from '../../../shared/dtos';
import {
  AdminOutput,
  ChangePasswordDto,
  CreateAdminInput,
  CreateUserInput,
  UserOutputDto,
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

  @Post('user')
  @UseGuards(JwtAuthGuard)
  public async createNewUser(
    @Body() body: CreateUserInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return await this.userService.createUser(body);
  }

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