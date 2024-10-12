import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { Equals, IsOptional, ValidateIf } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsOptional()
  @ValidateIf((obj) => obj.file !== null)
  @Equals('null')
  file?: null | 'null';
}
