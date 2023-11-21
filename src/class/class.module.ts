import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '#entity/user/admin.entity';
import { Major } from '#entity/major.entity';
import * as controllers from './controllers';
import * as providers from './providers';
import { Class } from '#entity/class.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Admin, Major, Class])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class ClassModule {}
