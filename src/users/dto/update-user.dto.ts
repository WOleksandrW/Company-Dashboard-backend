import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Equals, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Username of the user.',
    example: 'robert_patt',
    minLength: 3,
    maxLength: 20,
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Email of the user.',
    example: 'example@email.com',
    maxLength: 254,
  })
  email?: string;

  @ApiPropertyOptional({
    description: `Password with at least:
      - One uppercase letter
      - One lowercase letter
      - One number
      - One special character`,
    example: 'NewStrongP@ssw0rd!',
    minLength: 8,
    maxLength: 20,
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Optional file field, which must either be `null` or the string `"null"`.',
    example: 'null',
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((obj) => obj.file !== null)
  @Equals('null', { message: 'File must be the string "null".' })
  file?: null | 'null';

  @ApiPropertyOptional({
    description: 'The old password, required only if the password is being updated.',
    example: 'StrongP@ssw0rd!',
  })
  @IsOptional()
  @IsString({ message: 'Old password must be a string.' })
  oldPassword?: string;
}
