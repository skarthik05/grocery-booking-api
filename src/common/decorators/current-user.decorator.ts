import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayload } from 'src/auth/interface/token-payload.interface';
export const CurrentUser = createParamDecorator(
  (data: keyof ITokenPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ITokenPayload;
    return data ? user?.[data] : user;
  },
);
