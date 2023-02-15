import { Module } from '@nestjs/common';
import { GPTService } from './gpt.service';

@Module({
  controllers: [],
  providers: [GPTService],
  exports: [GPTService],
})
export class GPTModule {}
