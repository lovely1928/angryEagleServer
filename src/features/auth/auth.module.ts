import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      global: true, secret: 'jwtSecret',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    PassportModule,
    JwtModule
  ]
})
export class AuthModule { }
