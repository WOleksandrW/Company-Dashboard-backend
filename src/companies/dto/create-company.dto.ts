import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company title is required.' })
  @IsString({ message: 'Company title must be a string.' })
  @MinLength(3, { message: 'Title must have at least 3 characters.' })
  @MaxLength(50, { message: 'Title must not exceed 50 characters.' })
  @Matches(/^[a-zA-Z0-9\s]*$/, {
    message: 'Title can only contain letters, numbers, and spaces.',
  })
  title: string;

  @IsNotEmpty({ message: 'Service description is required.' })
  @IsString({ message: 'Service must be a string.' })
  @Length(1, 30, {
    message: 'Service must be between 1 and 30 characters.',
  })
  service: string;

  @IsNotEmpty({ message: 'Address is required.' })
  @IsString({ message: 'Address must be a string.' })
  @MaxLength(100, { message: 'Address must not exceed 100 characters.' })
  address: string;

  @IsNotEmpty({ message: 'Capital is required.' })
  @IsInt({ message: 'Capital must be an integer.' })
  @Type(() => Number)
  capital: number;

  @IsOptional()
  @IsInt({ message: 'User ID must be an integer.' })
  @Type(() => Number)
  userId: number;
}
