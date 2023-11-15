import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ANNOUNCEMENT_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'announcement', schema: process.env.DB_SCHEMA })
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'title' })
  title: string;

  @Column('text', { nullable: false, name: 'content' })
  content: string;

  @Column('varchar', { nullable: false, name: 'user_id' })
  userId: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: ANNOUNCEMENT_STATUS.ACTIVE,
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

  @Column({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt: Date | null;
}
