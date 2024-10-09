import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ERole } from 'src/enums/role.enum';
import { InfiniteToken } from 'src/constants/swagger-constants';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to system.' })
  @ApiBody({
    description: 'Email and password to login',
    schema: {
      example: { email: 'example-100@gmail.com', password: 'asd@3ASD' }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The jwt token has been successfully received.',
    schema: {
      example: { access_token: InfiniteToken }
    }
  })
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up to system.' })
  @ApiBody({
    description: 'User object that needs to be created.',
    schema: {
      example: { username: 'user100', email: 'example-100@gmail.com', password: 'asd@3ASD', role: ERole.ADMIN }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: { id: 100, username: 'user100', email: 'example-100@gmail.com', role: ERole.ADMIN, createdAt: "2024-10-03T14:00:27.515Z", updatedAt: "2024-10-03T14:10:01.005Z", deletedAt: null }
    },
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.create({ ...signUpDto, role: ERole.USER });
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT.' })
  @ApiBody({
    description: 'Refresh token',
    schema: { example: { token: InfiniteToken } }
  })
  @ApiResponse({
    status: 201,
    description: 'Token updated successfully.',
    schema: { example: InfiniteToken },
  })
  async refreshToken(@Body(ValidationPipe) { token }: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }
}
