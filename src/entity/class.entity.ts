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
import { Major } from './major.entity';
import { User } from './user/user.entity';

@Entity({ name: 'class', schema: process.env.DB_SCHEMA })
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('numeric', {
    nullable: true,
    name: 'start_year',
  })
  startYear: number;

  @Column('numeric', {
    nullable: true,
    name: 'finish_year',
  })
  finishYear: number;

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

  @ManyToOne(() => Admin, (admin) => admin.classes)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: Admin;

  @ManyToOne(() => Major, (major) => major.classes)
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: Major;

  @OneToMany(() => User, (user) => user.clas)
  users: User[];
}
