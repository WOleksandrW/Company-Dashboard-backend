import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user, consisting of letters, numbers, and underscores.',
    minLength: 3,
    maxLength: 20,
  })
  username: string;

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
