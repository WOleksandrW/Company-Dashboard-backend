import { IsOptional, IsInt, Min, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { EOrder } from 'src/enums/EOrder';

export class GetAllQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  user?: number;

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
  @IsEnum(EOrder)
  titleOrder?: EOrder;

  @IsOptional()
  @IsEnum(EOrder)
  serviceOrder?: EOrder;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  capitalMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  capitalMax?: number;
}
