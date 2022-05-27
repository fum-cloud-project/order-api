import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderCreateDto {
  @ApiProperty()
  @IsString()
  zip: string;
  @ApiProperty()
  @IsString()
  address: string;
}
