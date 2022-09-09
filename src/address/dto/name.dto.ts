import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class ResponseNameDto {
  @ApiProperty()
  status: string;
  @ApiProperty()
  data: string[];
}
