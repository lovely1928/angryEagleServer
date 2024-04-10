import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  create(@Body() createChatDto: any) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll(@Query() params) {
    return this.chatService.getConversation(params);
  }
  @Get('summary')
  @UseGuards(AuthGuard('jwt'))
  findAllConvos(@Query() params, @Request() req) {
    params.userId = req.user.id
    return this.chatService.findAllConvos(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: any) {
    return this.chatService.update(id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
