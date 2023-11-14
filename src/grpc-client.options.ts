import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import 'dotenv/config';
import * as process from 'process';

const loadEnvMode = (mode: string) => {
  const fixedPath = 'protos/sample/sample.proto';
  let protoPaths = [join(__dirname, '../src/', fixedPath)];
  if (mode === 'production') {
    protoPaths = [join(__dirname, '../dist/', fixedPath)];
  }
  return protoPaths;
};

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.PORT_GRPC_URL,
    package: [`sample`],
    protoPath: loadEnvMode(process.env.NODE_ENV),
  },
};
