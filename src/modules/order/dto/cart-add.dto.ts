import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsMongoId, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;
  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CartAddDto {
  @ApiProperty()
  @IsMongoId()
  cartId: string;

  @ApiProperty({ type: CartItemDto, isArray: true })
  @IsArray()
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
