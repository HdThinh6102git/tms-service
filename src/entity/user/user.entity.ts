import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Province } from './address/province.entity';
import { District } from './address/district.entity';
import { Ward } from './address/ward.entity';
import { Class } from '../class.entity';

export enum USER_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
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

  @Column('varchar', {
    nullable: true,
    name: 'birth_date',
  })
  birthDate: string;

  @Column('varchar', { nullable: false, name: 'phone_number' })
  phoneNumber: string;

  @Column('varchar', { nullable: false, name: 'email' })
  email: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: USER_STATUS.ACTIVE,
  })
  status: number;

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

  @ManyToOne(() => Class, (clas) => clas.users)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
  clas: Class;
}
