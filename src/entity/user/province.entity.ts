import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'province', schema: process.env.DB_SCHEMA })
export class Province {
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

  @OneToMany(() => User, (user) => user.province)
  users: User[];
}
