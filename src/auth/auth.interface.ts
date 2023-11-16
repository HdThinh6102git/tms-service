import { RoleOutput } from './dtos';

export interface JwtPayload {
  id: string;
  username: string;
  role: RoleOutput;
}

export interface Payload {
  id: string;
  username: string;
  role: RoleOutput;
}

export interface RefreshTokenPayload {
  sub: string;
}

export interface AdminPayload {
  id: string;
  username: string;
}

export interface JwtAdminPayload {
  id: string;
  username: string;
}
