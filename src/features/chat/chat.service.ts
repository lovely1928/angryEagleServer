import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {


  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private userService: UserService
  ) { }

  async create(model: any) {
    const chat = await this.chatRepository.create(model);
    const saved = await this.chatRepository.save(chat)
    console.log(saved)
  }

  findAll() {
    return `This action returns all chat`;
  }

  async getConversation(model) {
    const { userId, otherUserId, } = model
    const conversationId = [userId, otherUserId].sort().join('.')
    try {
      const { data } = await this.userService.findOne(otherUserId)
      const chatData = await this.chatRepository.find({ where: { conversationId }, order: { time: 'ASC' } })
      // console.log(chatData)
      return { data: { messages: chatData, user: data } }
    }
    catch (e) {
      console.log(e)
    }
  }
  async findAllConvos(model) {
    const { userId, } = model
    // const conversationId = [userId, otherUserId].sort().join('.')
    try {

      //   const chatData = await this.chatRepository.query(`SELECT c.message, c.time, c.from, c.to, otherUser.firstName AS name	, otherUser.lastName AS lastName,
      //   CASE 
      //       WHEN c.to =${userId} THEN c.from
      //       WHEN c.from = ${userId} THEN c.to
      //       ELSE NULL
      //      END
      //      AS otherUserId
      // FROM chat c
      // JOIN (
      //     SELECT conversationId, MAX(time) AS max_time
      //     FROM chat
      //     WHERE to = ${userId} OR from = ${userId}
      //     GROUP BY conversationId
      // ) AS max_times
      // ON c.conversationId = max_times.conversationId AND c.time = max_times.max_time
      // JOIN user AS otherUser ON otherUser.id =    CASE 
      //         WHEN c.to = ${userId} THEN c.from
      //         WHEN c.from = ${userId} THEN c.to
      //         ELSE NULL
      //     END;
      // `)
      const query = `
SELECT c.message, c.time, c.from, c.to, otherUser.firstName AS name	, otherUser.lastName AS lastName,
CASE 
    WHEN c.to =? THEN c.from
    WHEN c.from = ? THEN c.to
    ELSE NULL
   END
   AS otherUserId
FROM chat c
JOIN (
  SELECT conversationId, MAX(time) AS max_time
  FROM chat
  WHERE 'to' = ? OR 'from' =?
  GROUP BY conversationId
) AS max_times
ON c.conversationId = max_times.conversationId AND c.time = max_times.max_time
JOIN user AS otherUser ON otherUser.id = CASE 
      WHEN c.to = ?  THEN c.from
      WHEN c.from = ? THEN c.to
      ELSE NULL
  END
`
      const chatData = await this.chatRepository.query(`
SELECT c.message, c.time, c.from, c.to, otherUser.firstName AS name, otherUser.lastName AS lastName,otherUser.profileImage AS profileImage,
    CASE 
        WHEN c.to = ? THEN c.from
        WHEN c.from = ? THEN c.to
        ELSE NULL
    END AS otherUserId
FROM chat c
JOIN (
    SELECT conversationId, MAX(time) AS max_time
    FROM chat
    WHERE \`to\` = ? OR \`from\` = ?
    GROUP BY conversationId
) AS max_times
ON c.conversationId = max_times.conversationId AND c.time = max_times.max_time
JOIN user AS otherUser ON otherUser.id = CASE 
    WHEN c.to = ? THEN c.from
    WHEN c.from = ? THEN c.to
    ELSE NULL
END;
`, [userId, userId, userId, userId, userId, userId]);
      // const chatData = await this.chatRepository.query(query, [userId, userId, userId, userId, userId, userId]);
      // console.log(chatData)
      return ({ data:chatData,status:200 })
    }
    catch (e) {
      console.log(e)
    }
  }



  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  update(id: string, updateChatDto: any) {
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
