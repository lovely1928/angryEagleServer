import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  private connections: Map<string, string> = new Map(); // Map userId to socketId

  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      if (client.handshake.auth.token) {
        const user = await this.getDataFromToken(client.handshake.auth.token);
        this.connections.set(user.id, client.id);
        console.log(this.connections);
        await this.updateUserStatus(user.id, true, client.id);
        console.log(`Client connected: ${client.id}`);
      } else {
        console.log('No token provided');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getDataFromToken(token) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: 'jwtSecret',
    });

    return payload;
  }
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = [...this.connections.entries()].find(
      ([_, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.connections.delete(userId);
      await this.updateUserStatus(userId, false, '');
    }
  }

  private async updateUserStatus(
    userId: string,
    isOnline: boolean,
    socketId: string,
  ) {
    // Update user status in the database
    const updateObj = { isOnline, socketId };
    await this.userService.update(userId, updateObj);
    // Broadcast online/offline status to other users
    this.server.emit('isOnline', { userId, isOnline });
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(client: Socket, payload: any) {
    console.log(`Message from client ${client.id}: ${payload}`);
    // Save message to the database
    // console.log((payload.to + payload.from))
    const chatRoom = payload.conversationId;
    payload.conversationId = chatRoom;
    const saveChat = await this.chatService.create(payload);
    // Emit message to sender
    client.join(chatRoom);
    this.server.to(chatRoom).emit('messageToClient', payload);
    // Emit message to receiver if available
    const receiverSocketId = this.connections.get(payload.to);
    if (receiverSocketId && receiverSocketId !== client.id) {
      this.server.to(receiverSocketId).emit('messageToClient', payload);
    }
  }
}
