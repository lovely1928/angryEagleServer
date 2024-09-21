import * as moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { User } from 'src/features/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
}
