import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SampleService } from '../providers/sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}
  @GrpcMethod('SampleService', 'SayHello')
  @Get()
  SayHello() {
    return this.sampleService.getHello();
  }
}
