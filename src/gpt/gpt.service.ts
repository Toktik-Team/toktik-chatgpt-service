import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';
import { ChatGPTSession } from './gpt.entity';

@Injectable()
export class GPTService {
  constructor(
    @InjectRepository(ChatGPTSession)
    private repository: Repository<ChatGPTSession>,
  ) {}
  async onModuleInit() {
    const chatgpt = await import('chatgpt');
    const chat = new chatgpt.ChatGPTAPI({
      apiKey: process.env.CHATGPT_API_KEY,
      debug: process.env.NODE_ENV === 'development',
    });
    // TODO: support password
    const client = createClient({
      url: `redis://${process.env.REDIS_ADDR}/${process.env.REDIS_DB}`,
    });
    const subscriber = client.duplicate();
    subscriber.on('error', (err) => console.error(err));
    await subscriber.connect();
    await client.connect();

    await subscriber.subscribe('chatgpt', async (message, channel) => {
      try {
        Logger.debug(`Received message ${message} on channel ${channel}`);

        message = JSON.parse(message);
        const senderId = message['senderId'];
        // check from the db if the conversation id is not empty
        const session = await this.repository.findOne({
          where: { userID: senderId },
        });
        const opts: any = {};
        if (session) {
          Logger.log(`ChatGPT Session: ${JSON.stringify(session)}`);
          opts.conversationId = session.conversationId;
          opts.parentMessageId = session.parentMessageId;
        }
        const resp = await chat.sendMessage(message['msg'], {
          timeoutMs: 30 * 60 * 1000,
          ...opts,
        });
        Logger.log(`ChatGPT Response: ${resp.text}`);
        // save the conversation id and parent message id
        if (resp.conversationId && resp.parentMessageId) {
          if (session) {
            session.conversationId = resp.conversationId;
            session.parentMessageId = resp.parentMessageId;
            await this.repository.save(session);
          } else {
            await this.repository.save({
              userID: senderId,
              conversationId: resp.conversationId,
              parentMessageId: resp.parentMessageId,
            });
          }
        }

        const responseChannel = `chat:0:${senderId}`;
        const score = new Date().getTime();
        const redisResult = await client.zAdd(responseChannel, {
          score: score,
          value: resp.text,
        });
        Logger.log(`Redis Response: ${redisResult}`);
      } catch (err) {
        Logger.error(err);
      }
    });
    console.log('GPTService initialized');
  }
}
