import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { LikePost } from './entities/postLike.entity';
import { CommentPost } from './entities/postComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, LikePost, CommentPost ])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
