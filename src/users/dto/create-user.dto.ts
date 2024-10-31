import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERole } from 'src/enums/role.enum';
import { passwordRegExp, usernameRegExp } from 'src/helpers/regexps';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user, consisting of letters, numbers, and underscores.',
    minLength: 3,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  @Matches(usernameRegExp, { message: 'Username can only contain letters, numbers, and underscores.' })
  username: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'A valid email address for the user.',
    maxLength: 254,
  })
  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(254, { message: 'Email must not exceed 254 characters.' })
  @IsEmail({}, { message: 'Please provide valid Email.' })
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
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must have at least 8 characters.' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters.' })
  @Matches(passwordRegExp, {
    message: `Password must contain at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @ApiProperty({
    enum: [ERole.USER, ERole.ADMIN],
    example: ERole.USER,
    description: 'The role assigned to the user. Can be either USER or ADMIN.',
  })
  @IsNotEmpty({ message: 'Role is required.' })
  @IsString({ message: 'Role must be a string.' })
  @IsEnum([ERole.USER, ERole.ADMIN], { message: 'Valid role required' })
  role: ERole;
}
