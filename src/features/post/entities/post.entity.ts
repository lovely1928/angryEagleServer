import * as moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BaseEntity, BeforeInsert, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { LikePost } from './postLike.entity';
import { CommentPost } from './postComment.entity';

@Entity()
export class Post extends BaseEntity {
 
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @Column()
  userId: string;

    @Column({ default: true })
    isActive: boolean;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(); // This will generate a unique nanoid for the ID
  }
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "userId" })
  user: User

  @OneToMany(() => LikePost, (likePost) => likePost.post)
  likes: LikePost[]

  @OneToMany(() => CommentPost, (commentPost) => commentPost.post)
  comments: CommentPost[]


  // @CreateDateColumn({ type: "timestamp", default: () => moment().unix() })
  // public created_at: number;

  // @UpdateDateColumn({ type: "timestamp", default: () =>  moment().unix()})
  // public updated_at: number;
}
