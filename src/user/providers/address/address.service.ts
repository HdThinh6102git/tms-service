import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { MESSAGES } from '../../../shared/constants';
import { plainToInstance } from 'class-transformer';
import {
  DistrictOutput,
  DistrictParamsDto,
  ProvinceOutput,
  WardOutput,
  WardParamsDto,
} from '../../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
    @InjectRepository(District)
    private districtRepo: Repository<District>,
    @InjectRepository(Ward)
    private wardRepo: Repository<Ward>,
  ) {}
  public async importAddressData() {
    try {
      const filePathProvince = join(
        __dirname,
        '../../../../seeds/json/',
        'provinces.json',
      );
      const filePathDistrict = join(
        __dirname,
        '../../../../seeds/json/',
        'districts.json',
      );
      const filePathWard = join(
        __dirname,
        '../../../../seeds/json/',
        'wards.json',
      );
      const provinceRawData = await readFile(filePathProvince, 'utf-8');
      const districtRawData = await readFile(filePathDistrict, 'utf-8');
      const wardRawData = await readFile(filePathWard, 'utf-8');

      const provinceParseData = JSON.parse(provinceRawData);
      const districtParseData = JSON.parse(districtRawData);
      const wardParseData = JSON.parse(wardRawData);

      const provinceData: any[] = [];
      const districtData: any[] = [];
      const wardData: any[] = [];

      provinceParseData.provinces.forEach((province: any) => {
        const object = {
          id: province['id'],
          name: province['name'],
          level: province['level'],
        };
        provinceData.push(object);
      });

      districtParseData.districts.forEach((district: any) => {
        const object = {
          id: district['id'],
          name: district['name'],
          level: district['level'],
          provinceId: district['provinceId'],
        };
        districtData.push(object);
      });

      wardParseData.wards.forEach((ward: any) => {
        const object = {
          id: ward['id'],
          name: ward['name'],
          level: ward['level'],
          districtId: ward['districtId'],
        };
        wardData.push(object);
      });

      await this.provinceRepo.save(provinceData);
      await this.districtRepo.save(districtData);
      await this.wardRepo.save(wardData);

      return { message: MESSAGES.IMPORT_SUCCESSFUL };
    } catch (error: any) {
      return { message: MESSAGES.IMPORT_FAILED, error: error.message };
    }
  }

  public async getAllProvinces(): Promise<
    BaseApiResponse<BasePaginationResponse<ProvinceOutput>>
  > {
    const [provincesRawData, count] = await this.provinceRepo.findAndCount({
      order: { name: 'ASC' },
    });
    const output = plainToInstance(ProvinceOutput, provincesRawData, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: {
        listData: output,
        total: count,
      },
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
  public async getDistricts(
    districtParam: DistrictParamsDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<DistrictOutput>>> {
    const where: any = {};
    where.provinceId = districtParam.provinceId;
    const [districtsRawData, count] = await this.districtRepo.findAndCount({
      where: where,
      order: { name: 'ASC' },
    });
    const output = plainToInstance(DistrictOutput, districtsRawData, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: {
        listData: output,
        total: count,
      },
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
  public async getWards(
    wardParams: WardParamsDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<WardOutput>>> {
    const where: any = {};
    where.districtId = wardParams.districtId;
    const [wardsRawData, count] = await this.wardRepo.findAndCount({
      where: where,
      order: { name: 'ASC' },
    });
    const output = plainToInstance(WardOutput, wardsRawData, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: {
        listData: output,
        total: count,
      },
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
}
