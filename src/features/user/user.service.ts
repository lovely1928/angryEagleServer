import { Body, HttpException, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowService } from '../follow/follow.service';
import { FollowStatus } from 'src/common/enums/followStatus.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly followService: FollowService
  ) { }

  async create(model) {
    try {
      const user = await this.usersRepository.create(model);

      const saved = await this.usersRepository.save(user)

      console.log(saved)
      return { message: 'User Created' }
    } catch (e) {
      console.log(e);
    }
  }

  async findAll({ sort, order, search, limit = 10, page }) {
    try {
      const offset = limit * (page - 1)
      const sortObj: any = { [sort]: order }
      let whereCond: any = { isActive: true }
      if (search) {
        whereCond['firstName'] = Like(`%${search}%`)
        // whereCond['lastName'] =   search  
        // whereCond['email'] =   search  
      }
      // console.log({
      //   where: whereCond,
      //   order: sortObj,
      //   skip: offset,
      //   take: limit
      // })
      const users = await this.usersRepository.find({
        where: whereCond,
        order: sortObj,
        skip: +offset,
        take: limit
      })
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const totalUsers = await this.usersRepository.count()
      setTimeout(() => { }, 5000)
      return { data: users, totalUsers }

    }
    catch (e) {
      console.log(e)
    }
  }

  async findOne(id: string) {
    try {
      const user: any = await this.usersRepository.findOne({ where: { id } })

      return { data: user }
    }
    catch (e) {
      console.log(e)
    }
  }
  async findOneByAttribute(attributeObj) {
    try {
      const user: any = await this.usersRepository.findOne({ where: attributeObj })

      return { data: user }
    }
    catch (e) {
      console.log(e)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    try {
      const user = await this.usersRepository.findOne({ where: { id } })

      if (!user) {
        throw new HttpException({ status: 400, error: 'Cannot find User' }, 400)
      }
      Object.assign(user, updateUserDto)
      const updatedEntity = await this.usersRepository.save(user);

      return { message: 'User Updated' }
    }
    catch (e) {
      console.log(e)
    }
  }

  async remove(id: string) {

    try {
      const user = await this.usersRepository.findOne({ where: { id } })


      if (!user) {
        throw new HttpException({ status: 400, error: 'Cannot find User' }, 400)
      }
      Object.assign(user, { isActive: false })
      const updatedEntity = await this.usersRepository.save(user);

      return updatedEntity;
    }
    catch (e) {
      console.log(e)
    }
  }

  async getUserProfile(model) {
    try {
      const user: any = await this.usersRepository.findOne({
        where: { id: model.id }, relations: {
          posts: true
        }
      })
      const isLoggedInUserFollowProfile = await this.followService.findOneByAttribute({
        userId: model.id,
        followedBy: model.profileId,
        status: FollowStatus.FOLLOWING
      })
      const followers: any = await this.followService.findAllFollowers({ userId: model.id, profileId: model.profileId })
      const following: any = await this.followService.findAllFollowing({ userId: model.id, profileId: model.profileId })
      user.followers = followers.data
      user.following = following.data
      user.followingCount = following.data.length || 0
      user.followerCount = followers.data.length || 0
      user.isLoggedInUserFollowProfile = isLoggedInUserFollowProfile || null
      user.isLoggedInUserFollowProfileStatus = isLoggedInUserFollowProfile?.status || null
      return { data: user }
    }
    catch (e) {
      console.log(e)
    }
  }
}
