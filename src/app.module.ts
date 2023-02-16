import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GPTModule } from './gpt/gpt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGPTSession } from './gpt/gpt.entity';
import { migration1676561421398 } from 'migrations/1676561421398-migration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
  imports: [GPTModule],
      synchronize: true,
      logging: false,
      entities: [ChatGPTSession],
      migrations: [migration1676561421398],
      subscribers: [],
    }),
    GPTModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
