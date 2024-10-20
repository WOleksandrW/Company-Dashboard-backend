import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'Use "true" as a string to remove file.',
    type: 'boolean',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  deleteFile?: boolean | 'true' | 'false';
}
