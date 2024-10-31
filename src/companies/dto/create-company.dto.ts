import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { titleRegExp } from 'src/helpers/regexps';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Title can only contain letters, numbers, and spaces.',
    example: 'TechCorp',
    minLength: 3,
    maxLength: 30
  })
  @IsNotEmpty({ message: 'Company title is required.' })
  @IsString({ message: 'Company title must be a string.' })
  @MinLength(3, { message: 'Title must have at least 3 characters.' })
  @MaxLength(30, { message: 'Title must not exceed 30 characters.' })
  @Matches(titleRegExp, { message: 'Title can only contain letters, numbers, and spaces.' })
  title: string;

  @ApiProperty({
    description: 'Description of the company`s services.',
    example: 'Software development',
    minLength: 4,
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'Service description is required.' })
  @IsString({ message: 'Service must be a string.' })
  @Length(4, 30, {
    message: 'Service must be between 4 and 30 characters.',
  })
  service: string;

  @ApiProperty({
    description: 'Address of the company.',
    example: '123 Main St, Cityville',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Address is required.' })
  @IsString({ message: 'Address must be a string.' })
  @MaxLength(100, { message: 'Address must not exceed 100 characters.' })
  address: string;

  @ApiProperty({
    description: 'Capital amount of the company (in dollars).',
    example: 50000,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Capital is required.' })
  @IsInt({ message: 'Capital must be an integer.' })
  @IsPositive({ message: 'Capital must be a positive integer' })
  @Type(() => Number)
  capital: number;

  @ApiPropertyOptional({
    description: 'ID of the associated user (optional).',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'User ID must be an integer.' })
  @IsPositive({ message: 'User ID must be a positive integer' })
  @Type(() => Number)
  userId: number;
}
