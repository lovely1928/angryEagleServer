import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto, @Request() req) {
    createPostDto.userId = req.user.id;
    return this.postService.create(createPostDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req, @Query() query) {
    let { self = false, userId } = query;
    if (JSON.parse(self)) userId = req.user.id;
    if (userId) userId = userId;
    return this.postService.findAll({ userId, self, req });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.postService.findOneByAttribute({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePostDto: any, @Request() req) {
    updatePostDto.userId = req.user.id;
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Post('like')
  @UseGuards(AuthGuard('jwt'))
  likePost(@Body() likePostDto, @Request() req) {
    likePostDto.userId = req.user.id;
    return this.postService.likePost(likePostDto);
  }

  @Get('like/:postId')
  @UseGuards(AuthGuard('jwt'))
  getLikePost(@Param('postId') postId, @Request() req) {
    return this.postService.getPostLikes({ postId, profileId: req.user.id });
  }

  @Post('comment')
  @UseGuards(AuthGuard('jwt'))
  commentPost(@Body() likePostDto, @Request() req) {
    likePostDto.userId = req.user.id;
    return this.postService.commentPost(likePostDto);
  }

  @Get('comment/:postId')
  @UseGuards(AuthGuard('jwt'))
  getCommentPost(@Param('postId') postId, @Request() req) {
    return this.postService.getCommentPost({ postId });
  }
}
