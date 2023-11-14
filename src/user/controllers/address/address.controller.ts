import { Controller, Get, Post, Query } from '@nestjs/common';
import { AddressService } from '../../providers';

import {
  DistrictOutput,
  DistrictParamsDto,
  ProvinceOutput,
  WardOutput,
  WardParamsDto,
} from '../../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';

@Controller('admin/address')
export class AddressController {
  constructor(private addressService: AddressService) {}
  @Post('import')
  public async importDataAddress() {
    return this.addressService.importAddressData();
  }
}

@Controller('address')
export class UserAddressController {
  constructor(private addressService: AddressService) {}
  @Get('provinces')
  public async getAllProvinces(): Promise<
    BaseApiResponse<BasePaginationResponse<ProvinceOutput>>
  > {
    return this.addressService.getAllProvinces();
  }
  @Get('districts')
  public async getDistricts(
    @Query() districtParam: DistrictParamsDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<DistrictOutput>>> {
    return this.addressService.getDistricts(districtParam);
  }
  @Get('wards')
  public async getWards(
    @Query() wardParams: WardParamsDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<WardOutput>>> {
    return this.addressService.getWards(wardParams);
  }
}
