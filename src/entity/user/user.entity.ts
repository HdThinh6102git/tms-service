import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Province } from './province.entity';
import { District } from './district.entity';
import { Ward } from './ward.entity';

export enum USER_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}
@Entity({ name: 'user', schema: process.env.DB_SCHEMA })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'username' })
  username: string;

  @Column('varchar', { nullable: false, name: 'password' })
  password: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('text', { nullable: true, name: 'full_address' })
  fullAddress: string;

  @Column('text', { nullable: true, name: 'specific_address' })
  specificAddress: string;

  @Column('timestamp', {
    nullable: true,
    name: 'birth_date',
  })
  birthDate: Date;

  @Column('varchar', { nullable: false, name: 'phone_number' })
  phoneNumber: string;

  @Column('varchar', { nullable: false, name: 'email' })
  email: string;

  @Column('varchar', {
    nullable: false,
    name: 'status',
    default: USER_STATUS.ACTIVE,
  })
  status: string;

  @Column('varchar', { nullable: true, name: 'refresh_token' })
  refreshToken: string;

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

  @Column('timestamp', {
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Province, (province) => province.users)
  @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
  province: Province;

  @ManyToOne(() => District, (district) => district.users)
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;
}
