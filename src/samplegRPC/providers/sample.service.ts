import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  getHello() {
    return { message: 'Hello World AAAAQ!' };
  }
}
