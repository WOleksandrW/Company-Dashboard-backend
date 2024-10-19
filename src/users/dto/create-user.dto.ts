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

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
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
