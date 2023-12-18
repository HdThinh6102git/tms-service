import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ROLE_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'role', schema: process.env.DB_SCHEMA })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { nullable: false, name: 'role_name' })
  name: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: ROLE_STATUS.ACTIVE,
  })
  status: number;

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
