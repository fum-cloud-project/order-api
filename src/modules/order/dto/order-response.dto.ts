import { CartResponseDto } from './cart-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class OrderResponseDto {
  @ApiProperty()
  @Expose()
  @Transform((it) => it.obj._id.toString())
  _id: string;

  @ApiProperty({ type: CartResponseDto })
  @Type(() => CartResponseDto)
  @Expose()
  cart: CartResponseDto;

  @ApiProperty()
  @Expose()
  zip: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
