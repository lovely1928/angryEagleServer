import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UserModule,AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway,],
})
export class ChatModule { }
