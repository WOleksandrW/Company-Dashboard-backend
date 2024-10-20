import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString({ message: 'Token must be a string.' })
  token: string;
}
