import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from './constants/strategy.constant';
import { UserModule } from '../user';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import * as providers from './providers';
import * as controllers from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Verification } from '#entity/user/verification.entity';

@Module({
  imports: [
    UserModule,
    SharedModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
          issuer: 'AuthService',
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Verification]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class AuthModule {}
