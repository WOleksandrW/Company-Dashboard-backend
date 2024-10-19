import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignInDto extends PickType(CreateUserDto, ['email', 'password']) {
  @ApiProperty({
    example: 'example@email.com',
    description: 'A valid email address for the user.',
    maxLength: 254,
  })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: `Password with at least:
    - One uppercase letter
    - One lowercase letter
    - One number
    - One special character`,
    minLength: 8,
    maxLength: 20,
  })
  password: string;
}
