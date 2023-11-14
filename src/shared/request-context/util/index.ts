import { Request } from 'express';
import { RequestContext } from '../request-context.dto';
import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from '../../constants';
import { UserAccessTokenClaims } from '../../../auth/dtos';
import { plainToClass } from 'class-transformer';
export function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
    ? request.header(FORWARDED_FOR_TOKEN_HEADER)
    : request.ip;
  const user = request.header('user') ? request.header('user') : request.user;
  ctx.user = plainToClass(UserAccessTokenClaims, user);

  return ctx;
}
