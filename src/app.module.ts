import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GPTModule } from './gpt/gpt.module';

@Module({
  imports: [GPTModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
