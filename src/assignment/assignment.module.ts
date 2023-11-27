import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { AuthModule } from '../auth';
import * as controllers from './controllers';
import * as providers from './providers';
import { Assignment } from '#entity/assignment.entity';
import { StudentProject } from '#entity/student-project.entity';
import { Topic } from '#entity/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Assignment, StudentProject, Topic]),
    AuthModule,
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class AssignmentModule {}
