import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ReqContext, RequestContext } from '../../shared/request-context';
import { BaseApiResponse } from '../../shared/dtos';
import { ChangePasswordDto, UpdateUserInput, UserProfileOutput } from '../dtos';
import { UserService } from '../providers';
import { JwtAuthGuard } from '../../auth/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return this.userService.getMyProfile(ctx.user.id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  public async changePassword(
    @ReqContext() ctx: RequestContext,
    @Body() input: ChangePasswordDto,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.changePassword(
      ctx.user.id,
      input.oldPassword,
      input.newPassword,
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateProfile(
    @ReqContext() ctx: RequestContext,
    @Body() body: UpdateUserInput,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return await this.userService.updateProfile(body, ctx.user.id);
  }
}
