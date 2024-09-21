import { nanoid } from 'nanoid';
import { User } from 'src/features/user/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Task } from './Task.entity';

@Entity()
export class SubTask extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  task_id: string;

  @Column()
  title: string;

  @Column({ default: false })
  isDone: boolean;

  @ManyToOne(() => Task, (task) => task.subTasks)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
}
