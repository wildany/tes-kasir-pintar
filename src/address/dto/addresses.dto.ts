import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  kota_id: string;
  @ApiProperty()
  nama: string;
}

export class RequestAddressDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  kota_id: string;
}

export class ResponseAddressDto {
  @ApiProperty()
  status: string;
  @ApiProperty({ type: [AddressDto] })
  data: AddressDto[];
}
