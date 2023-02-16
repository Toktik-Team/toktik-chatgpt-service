import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class GPTService {
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
      Logger.debug(`Received message ${message} on channel ${channel}`);
      message = JSON.parse(message);
      const resp = await chat.sendMessage(message['msg'], {
        timeoutMs: 30 * 60 * 1000,
      });
      Logger.log(`ChatGPT Response: ${resp.text}`);
      client.lPush(`chat:0:${message['sender_id']}`, resp.text);
    });
    console.log('GPTService initialized');
  }
}
