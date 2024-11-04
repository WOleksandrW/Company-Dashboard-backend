import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../constants/jwt-constants';
import { UsersService } from 'src/users/users.service';
import { errorCatcher } from 'src/helpers/errorCatcher';
import { EXCEPTION_TAG } from 'src/constants/error-constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? jwtConstants.secret
    });
  }

  async validate(payload: { sub: number, email: string }) {
    try {
      const user = await this.userService.findOneBy({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('', { description: EXCEPTION_TAG });
      }
      return user;
    } catch (error) {
      errorCatcher(error, 'JWT strategy error', EXCEPTION_TAG);
    }
  }
}

