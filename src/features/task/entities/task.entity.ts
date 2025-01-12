import { nanoid } from 'nanoid';
import { User } from 'src/features/user/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TaskMember } from './TaskMember.entity';
import { SubTask } from './SubTask.entity';
import { TASK_STATUS } from 'src/common/enums/taskStatus.enum';
import * as moment from 'moment-timezone';
import { Types } from 'mysql2';

@Entity()
export class Task extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: TASK_STATUS.ACTIVE })
  status: string;

  @Column()
  user_id: string;

  @Column()
  priority: string;

  @Column()
  projectId: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  dueDate: number;

  @Column({ default: moment().unix() })
  creationDate: number;

  @Column({ nullable: true })
  inProgressDate: number;

  @Column({ nullable: true })
  completionDate: number;

  @OneToMany(() => TaskMember, (member) => member.task)
  @JoinColumn({ name: 'id' })
  members: TaskMember[];

  @OneToMany(() => SubTask, (subtask) => subtask.task)
  @JoinColumn({ name: 'id' })
  subTasks: SubTask[];
}
