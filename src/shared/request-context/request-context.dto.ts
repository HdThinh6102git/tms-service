import { UserAccessTokenClaims } from '../../auth/dtos';

export class RequestContext {
  public requestID: string | undefined;

  public url: string;

  public ip: string | undefined;

  public user: UserAccessTokenClaims;
}
