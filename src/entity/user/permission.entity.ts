import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PERMISSION_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'permission', schema: process.env.DB_SCHEMA })
export class Permission {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { nullable: false, length: 255, name: 'permission_name' })
  name: string;

  @Column('varchar', {
    nullable: false,
    name: 'status',
    default: PERMISSION_STATUS.ACTIVE,
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
}
