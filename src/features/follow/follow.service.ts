import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowStatus } from 'src/common/enums/followStatus.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>
  ) { }

  async create(model) {
    try {
      const { userId, followedBy, status = FollowStatus.FOLLOWING } = model
      if (userId === followedBy) throw new BadRequestException()

      const followExist: any = await this.followRepository.findOne({ where: { userId, followedBy } })
      if (followExist?.status === FollowStatus.FOLLOWING) return { message: 'Aready followed', status: "success" }

      const newPost = await this.followRepository.create({ userId, followedBy, status })
      const saved = await this.followRepository.save(newPost)
      return { message: 'Followed', status: "success", data: newPost }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findAllFollowers({ userId, profileId }) {
    try {
      const where: any = { userId }
      const followers: any = await this.followRepository.createQueryBuilder('follow')
        .where(where)
        .innerJoinAndSelect('follow.follower', 'follower')
        // .innerJoinAndSelect('follow.follower', 'follower')
        // .addSelect('follow.followedBy', 'followedBy')
        // .addSelect(`CASE WHEN follow.followedBy =:profileId THEN true ELSE false END`, 'isProfileFollowing')
        // .setParameter('profileId', profileId)
        .getMany();

      //   const f2 = await this.followRepository.query(`
      //     SELECT f.*, u.*, f2.followedBy AS isProfileFollowing
      //     FROM follow f
      //     JOIN user u ON f.followedBy = u.id
      //     LEFT JOIN follow f2 ON f.followedBy = f2.userId AND f2.followedBy = ?
      //     WHERE f.userId = ?
      // `, [profileId, userId]);

      const f3 = await this.followRepository.createQueryBuilder('f')
        .select(['f.*', 'u.*', 'f2.followedBy AS isProfileFollowing'])
        .innerJoin(User, 'u', 'f.followedBy = u.id')
        .leftJoin(Follow, 'f2', 'f.followedBy = f2.userId AND f2.followedBy = :profileId', { profileId })
        .where('f.userId = :userId', { userId })
        .getRawMany();


      // const f4 = await this.followRepository.createQueryBuilder('f')
      //   .select(['u.id', 'u.username', 'u.email', 'CASE WHEN f2.userId IS NOT NULL THEN true ELSE false END AS isFollowing'])
      //   .innerJoin(User, 'u', 'f.userId = u.id')
      //   .leftJoin(Follow, 'f2', 'f.userId = f2.followedBy AND f2.userId = :profileId', { profileId })
      //   .where('f.followedBy = :userId', { userId })
      //   .getRawMany();
      /*
      SELECT u.id, u.username, u.email, 
            CASE WHEN f2.userId IS NOT NULL THEN TRUE ELSE FALSE END AS isFollowing
      FROM follow f
      INNER JOIN user u ON f.userId = u.id
      LEFT JOIN follow f2 ON f.userId = f2.followedBy AND f2.userId = :loggedInUserId
      WHERE f.followedBy = :userId;
      */
      f3.map((x) => {
        let follwer = { firstName: x.firstName, profileImage: x.profileImage, lastName: x.lastName, isProfileFollowing: x.isProfileFollowing, followedBy: x.followedBy, userId: x.followedBy }
        x.follower = follwer
        return x
      })
      return { data: f3 }
    }
    catch (e) {
      console.log(e)
    }
  }
  async findAllFollowing({ userId, profileId }) {
    try {
      const where: any = { followedBy: userId }
      const posts: any = await this.followRepository.createQueryBuilder('follow')
        .where(where)
        .innerJoinAndSelect('follow.following', 'following')
        .getMany();

      const f3 = await this.followRepository.createQueryBuilder('f')
        .select(['f.*', 'u.*', 'f2.followedBy AS isProfileFollowing'])
        .innerJoin(User, 'u', 'f.userId = u.id')
        .leftJoin(Follow, 'f2', 'f.userId = f2.userId AND f2.followedBy = :profileId', { profileId })
        .where('f.followedBy = :userId', { userId })
        .getRawMany();

      f3.map((x) => {
        let follwer = { firstName: x.firstName, profileImage: x.profileImage, lastName: x.lastName, isProfileFollowing: x.isProfileFollowing, followedBy: x.followedBy, userId: x.userId }
        x.following = follwer
        return x
      })
      return { data: f3 }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findOneByAttribute(model) {
    try {
      const follow = await this.followRepository.findOne({ where: model })
      return follow
    }
    catch (e) {
      console.log(e)
    }
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
