import { Payload } from '../src/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      PORT_GRPC_URL: string;
      PORT_GRPC_PORT: string;
      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      DB_SCHEMA: string;
      DB_HOST_SLAVE: string;
      DB_PORT_SLAVE: string;
      DB_USER_SLAVE: string;
      DB_PASS_SLAVE: string;
      DB_NAME_SLAVE: string;
      DB_SCHEMA_SLAVE: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      id: string;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload {}
  }
}
