import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IUser } from 'src/common/interfaces/IUser';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(model: any) {
    try {
      const user: { data: IUser } = await this.usersService.findOneByAttribute({
        email: model.email,
      });
      if (!user) {
        throw new UnauthorizedException('Wrong Credentials');
      }
      if (user?.data.password !== model.password) {
        throw new UnauthorizedException('Wrong Credentials');
      }
      delete user.data.password;
      const { email, firstName, id, lastName, isActive, phone, profileImage } =
        user.data;
      const payload = {
        email,
        firstName,
        id,
        lastName,
        isActive,
        phone,
        profileImage,
      };
      let token = await this.jwtService.sign(payload);
      return {
        token,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async validateUser(payload) {
    try {
      const user = await this.usersService.findOneByAttribute({
        id: payload.id,
      });
      return { data: user };
    } catch (e) {
      console.log(e);
    }
  }
}
