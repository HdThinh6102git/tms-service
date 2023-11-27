import { Module } from '@nestjs/common';
import * as providers from './providers';
import * as controllers from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Verification } from '#entity/user/verification.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AssignmentService } from '../assignment/providers';
import { Assignment } from '#entity/assignment.entity';
import { Topic } from '#entity/topic.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification, Assignment, Topic]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
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
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers), AssignmentService],
  exports: Object.values(providers),
})
export class SharedModule {}
