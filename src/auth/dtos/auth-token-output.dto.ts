import { Expose, Type } from 'class-transformer';
import { RoleOutput } from './role-output.dto';

export class UserAccessTokenClaims {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  @Type(() => RoleOutput)
  role: RoleOutput;
}

export class AuthTokenOutput {
  @Expose()
  id: string;

  @Expose()
  token: string;

  @Expose()
  refreshToken: string;
}
