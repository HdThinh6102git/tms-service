import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

export enum ROLE_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'role', schema: process.env.DB_SCHEMA })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { nullable: false, name: 'role_name' })
  name: string;

  @Column('varchar', {
    nullable: false,
    name: 'status',
    default: ROLE_STATUS.ACTIVE,
  })
  status: string;

  @Column('timestamp', {
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
