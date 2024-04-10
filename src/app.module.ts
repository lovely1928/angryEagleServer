import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './features/user/user.module';
import { DataSource } from 'typeorm';
import { User } from './features/user/entities/user.entity';
import { AuthModule } from './features/auth/auth.module';
import { PostModule } from './features/post/post.module';
import { Post } from './features/post/entities/post.entity';
import { LikePost } from './features/post/entities/postLike.entity';
import { CommentPost } from './features/post/entities/postComment.entity';
import { Follow } from './features/follow/entities/follow.entity';
import { FollowModule } from './features/follow/follow.module';
import { ChatGateway } from './features/chat/chat.gateway';
import { ChatModule } from './features/chat/chat.module';
import { Chat } from './features/chat/entities/chat.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taskmanager',
      entities: [User, Post, LikePost, CommentPost,Follow,Chat],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FollowModule,
    PostModule,ChatModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
