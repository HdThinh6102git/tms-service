import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TopicRegistrationPhase } from '../topic-registration-phase.entity';
import { Topic } from '../topic.entity';
import { Major } from '../major.entity';

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

  @OneToMany(
    () => TopicRegistrationPhase,
    (topicRegistrationPhase) => topicRegistrationPhase.admin,
  )
  topicRegistrationPhases: TopicRegistrationPhase[];

  @OneToMany(() => Topic, (topic) => topic.admin)
  topics: Topic[];

  @OneToMany(() => Major, (major) => major.admin)
  majors: Major[];
}
