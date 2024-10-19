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

const usernameRegEx = /^[a-zA-Z0-9_]*$/;
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  @Matches(usernameRegEx, { message: 'Username can only contain letters, numbers, and underscores.' })
  username: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(254, { message: 'Email must not exceed 254 characters.' })
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must have at least 8 characters.' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters.' })
  @Matches(passwordRegEx, {
    message: `Password must contain at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @IsNotEmpty({ message: 'Role is required.' })
  @IsString({ message: 'Role must be a string.' })
  @IsEnum([ERole.USER, ERole.ADMIN], { message: 'Valid role required' })
  role: ERole;
}
