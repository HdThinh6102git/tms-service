import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { StudentProject } from './student-project.entity';
import { Topic } from './topic.entity';

@Entity({ name: 'assignment', schema: process.env.DB_SCHEMA })
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'title' })
  title: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Type(() => Date)
  @Column('text', {
    nullable: false,
    name: 'start_at',
  })
  startAt: Date;

  @Type(() => Date)
  @Column('text', {
    nullable: false,
    name: 'finish_at',
  })
  finishAt: Date;

  @Column('numeric', {
    nullable: false,
    name: 'status',
  })
  status: number;

  @Column('numeric', {
    nullable: false,
    name: 'score',
  })
  score: number;

  @Column('varchar', { nullable: false, name: 'result_file' })
  resultFile: string;

  @Column('text', {
    nullable: false,
    name: 'result_text',
  })
  resultText: string;

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

  @ManyToOne(
    () => StudentProject,
    (studentProject) => studentProject.assignments,
  )
  @JoinColumn({ name: 'student_project_id', referencedColumnName: 'id' })
  studentProject: StudentProject;

  @ManyToOne(() => Topic, (topic) => topic.assignments)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Topic;
}
