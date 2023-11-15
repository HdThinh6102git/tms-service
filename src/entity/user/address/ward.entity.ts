import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity({ name: 'ward', schema: process.env.DB_SCHEMA })
export class Ward {
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

  @Column('varchar', { nullable: false, name: 'district_id' })
  districtId: string;

  @OneToMany(() => User, (user) => user.ward)
  users: User[];
}
