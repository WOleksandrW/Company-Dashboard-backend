import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ERole } from 'src/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.create({ ...signUpDto, role: ERole.USER });
  }

  @Post('refresh-token')
  async refreshToken(@Body(ValidationPipe) { token }: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }
}
