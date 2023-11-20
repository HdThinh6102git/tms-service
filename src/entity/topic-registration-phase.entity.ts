import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from './user/admin.entity';
import { Type } from 'class-transformer';

@Entity({ name: 'topic_registration_phase', schema: process.env.DB_SCHEMA })
export class TopicRegistrationPhase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'title' })
  title: string;

  @Column('text', { nullable: false, name: 'description' })
  description: string;

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

  @ManyToOne(() => Admin, (admin) => admin.topicRegistrationPhases)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: Admin;
}
