import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '#entity/user/admin.entity';
import * as controllers from './controllers';
import * as providers from './providers';
import { Topic } from '#entity/topic.entity';
import { User } from '#entity/user/user.entity';
import { Major } from '#entity/major.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Admin, Topic, User, Major])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class TopicModule {}
