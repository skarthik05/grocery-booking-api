import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../users/users.service';
import { ITokenPayload } from './interface/token-payload.interface';
import { ENV_KEYS } from 'src/constants/env.constants';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get(ENV_KEYS.JWT_SECRET),
    });
  }

  async validate(payload: ITokenPayload) {
    const user = await this.userService.findUserById(payload.id);
    return {
      id: user.id,
      role: payload.role,
    };
  }
}
