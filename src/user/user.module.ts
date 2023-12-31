import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Role } from '#entity/user/role.entity';
import { Permission } from '#entity/user/permission.entity';
import * as controllers from './controllers';
import * as providers from './providers';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Admin } from '#entity/user/admin.entity';
import { SharedModule } from '../shared/shared.module';
import { Class } from '#entity/class.entity';
import { StudentProject } from '#entity/student-project.entity';
import { TopicRegistration } from '#entity/topic-registration.entity';
import { Assignment } from '#entity/assignment.entity';

@Module({
  imports: [
    SharedModule,
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
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Province,
      District,
      Ward,
      Admin,
      Class,
      StudentProject,
      TopicRegistration,
      Assignment,
    ]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class UserModule {}
