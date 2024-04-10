
import  * as  moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BaseEntity, BeforeInsert, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class LikePost extends BaseEntity {

  @PrimaryColumn()
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: "postId" })
  post: Post
  @ManyToOne(() => User, (user) => user.likes)
  user: User
  
  // @CreateDateColumn({ type: "timestamp", default: () => moment().unix() })
  // public created_at: number;

  // @UpdateDateColumn({ type: "timestamp", default: () => moment().unix() })
  // public updated_at: number;
}
