import { IsOptional, IsInt, Min, IsEnum, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ERole } from 'src/enums/ERole';

export class GetAllQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
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
