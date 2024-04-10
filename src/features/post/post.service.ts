import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikePost } from './entities/postLike.entity';
import { CommentPost } from './entities/postComment.entity';
import { User } from '../user/entities/user.entity';
import { Follow } from '../follow/entities/follow.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(LikePost)
    private likePostRepository: Repository<LikePost>,
    @InjectRepository(CommentPost)
    private commentPostRepository: Repository<CommentPost>
  ) { }

  async create(model: any) {
    try {
      // model.userId = req.user.id
      const newPost = await this.postRepository.create(model)
      const saved = await this.postRepository.save(newPost)
      return { message: 'Post Created', data: newPost }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findAll({ userId, self, req }) {
    try {
      const where: any = {}
      // await new Promise(resolve => setTimeout(resolve, 2000));
      if (userId) where.userId = userId
      const posts: any = await this.postRepository.createQueryBuilder('post')
        .where(where)
        .innerJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoinAndSelect('post.comments', 'comments')
        .getMany();
      posts.map((x: any) => {
        const canFollow = x.user.id === req.user.id ? false : true
        x.canFollow = canFollow
        x.likeCount = x.likes?.length || 0
        x.commentCount = x.comments?.length || 0
        return x
      })
      return { data: posts }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findOneByAttribute(attributeObj) {
    try {
      const user: any = await this.postRepository.findOne({ where: attributeObj })
      return { data: user }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findLikePost(attributeObj) {
    try {
      const user: any = await this.likePostRepository.findOne({ where: attributeObj })
      return { data: user }
    }
    catch (e) {
      console.log(e)
    }
  }
  async update(id: string, updatePostDto: any) {
    try {
      const user = await this.postRepository.findOne({ where: { id } })
      if (!user) {
        throw new HttpException({ status: 400, error: 'Cannot find User' }, 400)
      }
      Object.assign(user, updatePostDto)
      const updatedEntity = await this.postRepository.save(user);
      return { message: 'User Updated' }
    }
    catch (e) {
      console.log(e)
    }
  }

  async remove(id: string) {
    try {
      const user = await this.postRepository.findOne({ where: { id } })
      if (!user) {
        throw new HttpException({ status: 400, error: 'Cannot find User' }, 400)
      }
      Object.assign(user, { isActive: false })
      const updatedEntity = await this.postRepository.save(user);
      return updatedEntity;
    }
    catch (e) {
      console.log(e)
    }
  }

  async likePost(model) {
    try {
      const { postId, userId, } = model
      const likeData = await this.findLikePost({ postId, userId })
      if (likeData.data?.id) {
        return { message: 'Post already liked', status: 'success' }
      }
      const newLike = await this.likePostRepository.create({ postId, userId })
      const saved = await this.likePostRepository.save(newLike)
      return { message: 'Post Liked', data: newLike, status: 'success' }
    }
    catch (e) {
      console.log(e)
    }
  }
  async getPostLikes(model) {
    try {
      const { postId, profileId } = model
      const likeData = await this.likePostRepository.createQueryBuilder('likePost')
        .select([ 'likePost.*', 'u.*','f.followedBy AS isProfileFollowing'])
        .innerJoinAndSelect(User, 'u', 'likePost.userId = u.id')
        .leftJoinAndSelect(Follow, 'f', 'f.userId = u.id AND f.followedBy = :profileId', { profileId })
        .where({ postId })
        .getRawMany();

      // const f3 = await this.followRepository.createQueryBuilder('f')
      // .select(['f.*', 'u.*', 'f2.followedBy AS isProfileFollowing'])
      // .innerJoin(User, 'u', 'f.followedBy = u.id')
      // .leftJoin(Follow, 'f2', 'f.followedBy = f2.userId AND f2.followedBy = :profileId', { profileId })
      // .where('f.userId = :userId', { userId })
      // .getRawMany();


      const final = likeData.map((x) => {
        // x.followedBy = x.userId
        // x.isProfileFollowing = x.f_isProfileFollowing
        delete x.password
        return x
      })
      return { data: final, status: 'success' }
    }
    catch (e) {
      console.log(e)
    }
  }
  async commentPost(model) {
    try {
      const { postId, userId, comment } = model
      const newComment = await this.commentPostRepository.create({ postId, userId, comment })
      const saved = await this.commentPostRepository.save(newComment)
      return { message: 'Post Created', data: newComment }
    }
    catch (e) {
      console.log(e)
    }
  }
  async getCommentPost(model) {
    try {
      const { postId } = model
      const commentData = await this.commentPostRepository.createQueryBuilder('commentPost')
        .where({ postId })
        .innerJoinAndSelect('commentPost.user', 'user')
        .getMany();

      const final = commentData.map((x) => {
        delete x.user.password
        return x
      })
      return { data: final, status: 'success' }
    }
    catch (e) {
      console.log(e)
    }
  }
}
