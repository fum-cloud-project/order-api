import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PageDto {
  @ApiPropertyOptional()
  @IsOptional()
  limit: string;

  @ApiPropertyOptional()
  @IsOptional()
  skip: string;
}
