import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Task } from './Task.entity';
import { User } from 'src/features/user/entities/user.entity';
import { nanoid } from 'nanoid';

@Entity()
export class TaskMember extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  member_id: string;

  @Column()
  task_id: string;

  @ManyToOne(() => Task, (task) => task.members)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, (User) => User.taskMember)
  @JoinColumn({ name: 'member_id' })
  user: User;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
}
