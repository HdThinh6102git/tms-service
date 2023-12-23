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
import { Type } from 'class-transformer';
import { Admin } from './user/admin.entity';
import { Major } from './major.entity';
import { TopicRegistration } from './topic-registration.entity';
import { StudentProject } from './student-project.entity';
import { Assignment } from './assignment.entity';

export enum TOPIC_STATUS {
  TEACHER_ACTIVE = 1,
  STUDENT_ACTIVE = 2,
  WAITING_CONFIRMATION = 3,
  WAITING_CONFIRMATION_STUDENT = 4,
}

@Entity({ name: 'topic', schema: process.env.DB_SCHEMA })
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('text', { nullable: false, name: 'detail' })
  detail: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: TOPIC_STATUS.TEACHER_ACTIVE,
  })
  status: number;

  @Type(() => Date)
  @Column('text', {
    nullable: false,
    name: 'start_date',
  })
  startDate: Date;

  @Type(() => Date)
  @Column('text', {
    nullable: false,
    name: 'finish_date',
  })
  finishDate: Date;

  @Column('varchar', {
    nullable: true,
    name: 'review_teacher',
  })
  reviewTeacher: string;

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

  @Column('timestamptz', {
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Admin, (admin) => admin.topics)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: Admin;

  @ManyToOne(() => Major, (major) => major.topics)
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: Major;

  @OneToMany(
    () => TopicRegistration,
    (topicRegistration) => topicRegistration.topic,
  )
  topicRegistrations: TopicRegistration[];

  @OneToMany(() => StudentProject, (studentProject) => studentProject.topic)
  studentProjects: StudentProject[];

  @OneToMany(() => Assignment, (assignment) => assignment.topic)
  assignments: Assignment[];
}
