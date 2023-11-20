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
import { Admin } from './user/admin.entity';

@Entity({ name: 'topic', schema: process.env.DB_SCHEMA })
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('text', { nullable: false, name: 'detail' })
  detail: string;

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
}
