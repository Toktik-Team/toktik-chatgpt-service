import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ChatGPTSession } from './gpt/gpt.entity';
import { migration1676561421398 } from '../migrations/1676561421398-migration';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [ChatGPTSession],
  migrations: [migration1676561421398],
  subscribers: [],
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
