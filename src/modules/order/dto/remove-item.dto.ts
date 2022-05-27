import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class RemoveItemDto {
  @ApiProperty()
  @IsMongoId()
  itemId: string;
  @ApiProperty()
  @IsMongoId()
  cartId: string;
}
