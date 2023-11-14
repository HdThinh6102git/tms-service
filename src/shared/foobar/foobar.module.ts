import { Module } from '@nestjs/common';
import { FoobarService } from './foobar.service';

@Module({
  providers: [FoobarService],
  exports: [FoobarService],
})
export class FoobarModule {}
