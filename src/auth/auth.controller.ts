import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ERole } from 'src/enums/role.enum';
import { getUserResponse, InfiniteToken } from 'src/constants/swagger-constants';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to system.' })
  @ApiBody({ description: 'Email and password to login', type: SignInDto })
  @ApiCreatedResponse({
    description: 'The jwt token has been successfully received.',
    schema: {
      example: { access_token: InfiniteToken, refresh_token: InfiniteToken }
    }
  })
  async login(@Body() { email, password }: SignInDto) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up to system.' })
  @ApiBody({ description: 'User object that needs to be created.', type: SignUpDto })
  @ApiCreatedResponse({ description: 'The user has been successfully created.', schema: getUserResponse })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.create({ ...signUpDto, role: ERole.USER });
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT.' })
  @ApiBody({
    description: 'Refresh token',
    schema: { example: { token: InfiniteToken } }
  })
  @ApiCreatedResponse({
    description: 'Token updated successfully.',
    schema: { example: InfiniteToken },
  })
  async refreshToken(@Body(ValidationPipe) { token }: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }
}
