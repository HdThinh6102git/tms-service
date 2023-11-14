import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'district', schema: process.env.DB_SCHEMA })
export class District {
  @PrimaryColumn('varchar', { nullable: false, name: 'id' })
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('varchar', { nullable: false, name: 'level' })
  level: string;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column('timestamp', {
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('timestamp', {
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;

  @Column('varchar', { nullable: false, name: 'province_id' })
  provinceId: string;

  @OneToMany(() => User, (user) => user.district)
  users: User[];
}
