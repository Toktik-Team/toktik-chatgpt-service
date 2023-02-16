import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChatGPTSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: number;

  @Column()
  conversationId: string;

  @Column()
  parentMessageId: string;
}
