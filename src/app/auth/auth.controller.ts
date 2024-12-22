import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from '../auth-token/guard/jwt-auth.guard';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  logIn(@Body() signInDto: SignInDto) {
    return this.authService.singIn(signInDto);
  }

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin/new_token')
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() { key }) {
    await this.authService.logout(key);
    return { message: 'You have been logged out!', code: HttpStatus.OK };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async info(@Request() { user }) {
    return { id: user.id };
  }
}
