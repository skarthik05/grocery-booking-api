import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ROUTES } from '../constants/app.constants';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signin(@Body() createAuthDto: SignInDto, @Res() res: Response) {
    const cookie = await this.authService.signin(createAuthDto);
    res.setHeader('Set-Cookie', cookie);
    return res.sendStatus(200);
  }
  @Public()
  @Post('signout')
  signout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return res.sendStatus(200);
  }
  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
