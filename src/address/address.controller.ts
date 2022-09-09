import { Controller, Body, UseGuards, Post, Logger, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { AddressService } from './address.service';
import { RequestAddressDto, ResponseAddressDto } from './dto/addresses.dto';
import { NameDto, ResponseNameDto } from './dto/name.dto';

@ApiTags('Address')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class AddressController {
  private logger = new Logger('Address Controller');
  constructor(private readonly addressService: AddressService) {}

  @Post('/name')
  @ApiOkResponse({ type: ResponseNameDto })
  @ApiBody({ type: NameDto })
  async findAll(@Body() name: NameDto, @Req() req) {
    this.logger.verbose(
      `User ${req.user.username} getting address name with id : ${name.id}`,
    );
    return this.addressService.findNameById(name);
  }

  @Post('/addresses')
  @ApiOkResponse({ type: ResponseAddressDto })
  @ApiBody({ type: RequestAddressDto })
  findOne(@Body() address: RequestAddressDto, @Req() req) {
    this.logger.verbose(
      `User ${req.user.username} get kecamatan data with kota_id : ${address.kota_id}`,
    );
    return this.addressService.findKecamatanByKotaId(address);
  }
}
