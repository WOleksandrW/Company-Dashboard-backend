import { IsOptional, IsInt, IsEnum, IsString, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ERole } from 'src/enums/role.enum';

export class GetAllQueryDto {
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be a positive integer' })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive integer' })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsEnum([ERole.USER, ERole.ADMIN], { message: `role must be one of the following values: ${ERole.USER}, ${ERole.ADMIN}` })
  role?: ERole.USER | ERole.ADMIN;

  @IsOptional()
  @IsString()
  search?: string;
}
