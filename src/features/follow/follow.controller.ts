import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: any, @Request() req) {
     body.followedBy = req.user.id
    return this.followService.create(body);
  }

  @Get('followers')
  @UseGuards(AuthGuard('jwt'))
  findAllFollowers( @Request() req,@Query() query) {
    let {id:userId} = req.user
    if(query?.userId) userId = query.userId
    return this.followService.findAllFollowers({userId,profileId: req.user.id});
  }
  
  @Get('following')
  @UseGuards(AuthGuard('jwt'))
  findAllFollowing( @Request() req,@Query() query) {
    let {id:userId} = req.user
    if(query?.userId) userId = query.userId
    return this.followService.findAllFollowing({userId,profileId: req.user.id });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.followService.findOneByAttribute({id});
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.followService.remove(+id);
  }
}
