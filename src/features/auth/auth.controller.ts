import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() model) {
    // try {
      return this.authService.login(model);
    // } catch (e) {
    //   console.log(e);
    // }
  }

}
