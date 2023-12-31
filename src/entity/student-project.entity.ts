import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { TopicRegistration } from './topic-registration.entity';
export enum STUDENT_PROJECT_STATUS {
  WAITING_CONFIRMATION = 1,
  REFUSED = 2,
  ACTIVE = 3,
}
export enum PROJECT_ROLE {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}
@Entity({ name: 'student_project', schema: process.env.DB_SCHEMA })
export class StudentProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'student_id' })
  studentId: string;

  @Column('varchar', {
    nullable: false,
    name: 'role',
  })
  role: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
  })
  status: number;

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

  @ManyToOne(() => Topic, (topic) => topic.studentProjects)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Topic;

  @ManyToOne(
    () => TopicRegistration,
    (topicRegistration) => topicRegistration.studentProjects,
  )
  @JoinColumn({ name: 'topic_registration_id', referencedColumnName: 'id' })
  topicRegistration: TopicRegistration;
}
