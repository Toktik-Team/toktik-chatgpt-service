import { Module } from '@nestjs/common';
import { GPTService } from './gpt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGPTSession } from './gpt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatGPTSession])],
  controllers: [],
  providers: [GPTService],
  exports: [GPTService],
})
export class GPTModule {}
