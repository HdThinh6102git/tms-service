import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '#entity/announcement.entity';
import { AuthModule } from '../auth';
import { User } from '#entity/user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Announcement, User]), AuthModule],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class AnnouncementModule {}
