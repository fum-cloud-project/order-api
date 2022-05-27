import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageDto {
  @ApiPropertyOptional()
  skip: string;

  @ApiPropertyOptional()
  limit: string;
}
