import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from 'src/users/users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}
  @Get('/health')
  getHealth() {
    return { status: 'OK' };
  }

  @Get('me')
  getMe(@CurrentUser('id') id: number) {
    return this.userService.findUserById(id);
  }
}
