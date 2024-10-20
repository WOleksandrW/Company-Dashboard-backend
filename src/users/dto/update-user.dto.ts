import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'The old password, required only if the password is being updated.',
    example: 'StrongP@ssw0rd!',
  })
  @IsOptional()
  @IsString({ message: 'Old password must be a string.' })
  oldPassword?: string;

  @ApiPropertyOptional({
    description: 'Use "true" as a string to remove file.',
    type: 'boolean',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  deleteFile?: boolean | 'true' | 'false';
}
