import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { Equals, IsOptional, ValidateIf } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiPropertyOptional({
    description: 'Title can only contain letters, numbers, and spaces.',
    example: 'New Title',
    minLength: 3,
    maxLength: 30,
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the company`s services.',
    example: 'Marketing',
    minLength: 4,
    maxLength: 30,
  })
  service?: string;

  @ApiPropertyOptional({
    description: 'Address of the company.',
    example: '123 Main St, Italy',
    maxLength: 100,
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Capital amount of the company (in dollars).',
    example: 36744,
    minimum: 1,
  })
  capital?: number;

  @ApiPropertyOptional({
    description: 'ID of the associated user (optional).',
    example: 1,
    minimum: 1,
  })
  userId?: number;

  @ApiPropertyOptional({
    description: 'File field. Use "null" as a string to indicate no file.',
    example: 'null',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.file !== null)
  @Equals('null', { message: 'File must be equal to "null".' })
  file?: null | 'null';
}
