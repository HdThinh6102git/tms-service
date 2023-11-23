import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { User } from './user/user.entity';
import { StudentProject } from './student-project.entity';

export enum TOPIC_REGISTRATION_STATUS {
  WAITING_CONFIRMATION = 1,
  CANCELED = 0,
  REFUSED = 2,
  ACCEPTED = 3,
}

export enum TYPE {
  USER = 'USER',
  TEACHER = 'TEACHER',
}
@Entity({ name: 'topic_registration', schema: process.env.DB_SCHEMA })
export class TopicRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: true,
    name: 'message',
  })
  message: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: TOPIC_REGISTRATION_STATUS.WAITING_CONFIRMATION,
  })
  status: number;

  @Column('varchar', {
    nullable: false,
    name: 'type',
  })
  type: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Topic, (topic) => topic.topicRegistrations)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Topic;

  @ManyToOne(() => User, (user) => user.topicRegistrations)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(
    () => StudentProject,
    (studentProject) => studentProject.topicRegistration,
  )
  studentProjects: StudentProject[];
}
