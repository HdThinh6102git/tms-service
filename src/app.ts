import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 */
async function bootstrap(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';
  // for app micro
  const appMicro = await NestFactory.create(AppModule);
  let protoPaths = [join(__dirname, '../src/samplegRPC/sample.proto')];
  if (isProduction) {
    protoPaths = [join(__dirname, '../dist/samplegRPC/sample.proto')];
  }
  appMicro.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.PORT_GRPC_URL,
      package: ['sample'], // ['hero', 'hero2']
      protoPath: protoPaths, // ['./hero/hero.proto', './hero/hero2.proto']
    },
  });
  appMicro.useLogger(appMicro.get(Logger));
  appMicro.useGlobalInterceptors(new LoggerErrorInterceptor());
  // Express Middleware
  await appMicro.startAllMicroservices();
  // for http
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  if (isProduction) {
    app.enable('trust proxy');
  }
  // Express Middleware
  app.useStaticAssets(path.join(__dirname, '../uploads'));
  middleware(app);
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT || 3500);
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
