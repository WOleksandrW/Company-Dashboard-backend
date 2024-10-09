import {
  IsAlphanumeric,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Title does not allow other than alpha numeric chars.',
  })
  title: string;

  @IsString()
  @Length(1, 30)
  service: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  capital: number;

  @IsInt({ message: 'User ID must be an integer.' })
  userId: number;
}
