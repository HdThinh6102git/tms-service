import { Module } from '@nestjs/common';
import * as providers from './providers';
import * as controllers from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { Verification } from '#entity/user/verification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class SharedModule {}
