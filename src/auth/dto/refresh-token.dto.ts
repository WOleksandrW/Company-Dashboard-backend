import {
  IsNotEmpty,
  Length,
} from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @Length(179, 179, { message: 'Token must have 179 characters.' })
  token: string;
}
