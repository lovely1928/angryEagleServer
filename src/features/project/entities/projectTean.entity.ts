import { nanoid } from 'nanoid';
import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class ProjectTeam extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  projectId: string;

  @Column()
  userId: string;

  @Column({ default: '' })
  customRole: string;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
}
