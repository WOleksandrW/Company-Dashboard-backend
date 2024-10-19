import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Equals, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ValidateIf((obj) => obj.file !== null)
  @Equals('null', { message: 'File must be the string "null".' })
  file?: null | 'null';

  @IsOptional()
  @IsString({ message: 'Old password must be a string.' })
  oldPassword?: string;
}
