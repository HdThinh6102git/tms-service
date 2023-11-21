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
import { Admin } from './user/admin.entity';
import { Topic } from './topic.entity';

@Entity({ name: 'major', schema: process.env.DB_SCHEMA })
export class Major {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

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

  @ManyToOne(() => Admin, (admin) => admin.majors)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: Admin;

  @OneToMany(() => Topic, (topic) => topic.major)
  topics: Topic[];
}
