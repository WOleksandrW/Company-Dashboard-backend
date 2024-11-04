import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt-constants';
import { errorCatcher } from 'src/helpers/errorCatcher';
import { EXCEPTION_TAG } from 'src/constants/error-constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findOneBy({ email });

      const isPasswordValid = user && await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email or password is incorrect', { description: EXCEPTION_TAG });
      }

      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, { expiresIn: jwtConstants.refreshExpiresIn })
      };
    } catch (error) {
      errorCatcher(error, 'Login user error', EXCEPTION_TAG);
    }
  }

  async refreshToken(token: string) {
    try {
      const { exp, iat, ...rest } = await this.jwtService.decode(token);

      const user = await this.usersService.findOneBy({ email: rest.email });
      if (!user) {
        throw new NotFoundException('Your entry is not in the DB', { description: EXCEPTION_TAG });
      }

      return this.jwtService.sign(rest);
    } catch (error) {
      errorCatcher(error, 'Resresh token error', EXCEPTION_TAG);
    }
  }
}
