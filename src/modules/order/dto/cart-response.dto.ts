import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class CartItemResponseDto {
  @ApiProperty()
  @Expose()
  @Transform((it) => it.obj._id.toString())
  _id: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  price: number;
  @ApiProperty()
  @Expose()
  quantity: number;
}

export class CartResponseDto {
  @ApiProperty()
  @Expose()
  @Transform((it) => it.obj._id.toString())
  _id: string;
  @ApiProperty()
  @Expose()
  total: number;
  @ApiProperty({ type: CartItemResponseDto, isArray: true })
  @Expose()
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];
  @ApiProperty()
  @Expose()
  createdAt: Date;
  @ApiProperty()
  @Expose()
  status: string;
  @ApiProperty()
  @Expose()
  @Transform((it) => it.obj.userId.toString())
  userId: string;
}
