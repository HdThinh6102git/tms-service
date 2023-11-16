import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin', schema: process.env.DB_SCHEMA })
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'username' })
  username: string;

  @Column('varchar', { nullable: false, name: 'password' })
  password: string;

  @Column('varchar', { nullable: false, name: 'email' })
  email: string;
}
