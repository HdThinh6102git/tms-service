import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum VERIFICATION_TYPE {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}
@Entity({ name: 'verification', schema: process.env.DB_SCHEMA })
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'verification_code',
  })
  verificationCode: string;

  @Column('varchar', {
    nullable: false,
    name: 'user_id',
  })
  userId: string;

  @Column('varchar', {
    nullable: false,
    name: 'type',
  })
  type: string;

  @Column({ type: 'numeric', nullable: true, name: 'verification_time' })
  verificationTime: number;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}
