import { IsOptional, IsInt, IsString, IsEnum, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { EOrder } from 'src/enums/order.enum';

export class GetAllQueryDto {
  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  @IsPositive({ message: 'User ID must be a positive integer' })
  @Type(() => Number)
  user?: number;

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
  @IsInt({ message: 'Minimal capital must be an integer' })
  @IsPositive({ message: 'Minimal capital must be a positive integer' })
  @Type(() => Number)
  capitalMin?: number;

  @IsOptional()
  @IsInt({ message: 'Maximal capital must be an integer' })
  @IsPositive({ message: 'Maximal capital must be a positive integer' })
  @Type(() => Number)
  capitalMax?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
