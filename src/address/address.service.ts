import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { NameDto } from './dto/name.dto';
import { RequestAddressDto } from './dto/addresses.dto';

@Injectable()
export class AddressService {
  logger = new Logger('Address Service');
  constructor(private readonly httpService: HttpService) {}

  findNameById(nameId: NameDto) {
    const { id } = nameId;
    const value = this.httpService
      .get('https://kasirpintar.co.id/allAddress.txt')
      .pipe(
        map((response) => {
          let data = [];
          const status = response.data.status;
          if (id.length == 7) {
            data = response.data.address_kecamatan.filter(
              (address) => address.id == id,
            );
          } else if (id.length == 10) {
            data = response.data.address_kelurahan.filter(
              (address) => address.id == id,
            );
          } else if (id.length == 4) {
            data = response.data.address_kota.filter(
              (address) => address.id == id,
            );
          } else if (id.length == 2) {
            data = response.data.address_provinsi.filter(
              (address) => address.id == id,
            );
          }
          return {
            status,
            data: data,
          };
        }),
      );

    return value;
  }

  findKecamatanByKotaId(address: RequestAddressDto) {
    const { kota_id } = address;
    const value = this.httpService
      .get('https://kasirpintar.co.id/allAddress.txt')
      .pipe(
        map((response) => ({
          status: response.data.status,
          data: response.data.address_kecamatan.filter(
            (kecamatan) => kecamatan.kota_id == kota_id,
          ),
        })),
      );

    return value;
  }
}
