import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '../auth/jwt.authGuard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() model) {
    try {
      return this.userService.create(model);
    } catch (e) {
      console.log(e);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() params) {
    return this.userService.findAll(params);
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req, @Query() query) {
    let userId = req.user.id
    if (query.userId) userId = query.userId
    return this.userService.getUserProfile({ id: userId,profileId: req.user.id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
