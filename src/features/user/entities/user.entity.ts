import * as moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { Follow } from 'src/features/follow/entities/follow.entity';
import { Post } from 'src/features/post/entities/post.entity';
import { CommentPost } from 'src/features/post/entities/postComment.entity';
import { LikePost } from 'src/features/post/entities/postLike.entity';
import { Task } from 'src/features/task/entities/Task.entity';
import { TaskMember } from 'src/features/task/entities/TaskMember.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  profileImage: string;

  @Column()
  password: string;

  @Column({ default: '' })
  socketId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isOnline: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(() => Follow, (follow) => follow.follower)
  follower: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => LikePost, (likePost) => likePost.user)
  likes: LikePost[];

  @OneToMany(() => CommentPost, (commentPost) => commentPost.user)
  comments: CommentPost[];

  @OneToMany(() => Task, (task) => task.user)
  @JoinColumn({ name: 'id' })
  tasks: Task[];

  @OneToMany(() => TaskMember, (taskMember) => taskMember.user)
  // @JoinColumn({ name: 'id' })
  taskMember: TaskMember;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }

  // @CreateDateColumn({ type: "timestamp", default: () => moment().unix() })
  // public created_at: number;

  // @UpdateDateColumn({ type: "timestamp", default: () => moment().unix() })
  // public updated_at: number;
}
