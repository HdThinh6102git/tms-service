import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as providers from './providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '#entity/user/admin.entity';
import { TopicRegistrationPhase } from '#entity/topic-registration-phase.entity';
import { AuthModule } from '../auth';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TopicRegistrationPhase, Admin]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class TopicRegistrationPhaseModule {}
