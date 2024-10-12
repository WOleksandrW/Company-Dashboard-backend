import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Equals, IsOptional, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ValidateIf((obj) => obj.file !== null)
  @Equals('null')
  file?: null | 'null';
}
