import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeBlockModule } from './code-block/code-block.module';
dotenv.config();

const connectionString =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URL_PROD
    : process.env.MONGODB_URL;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(connectionString),
    CodeBlockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
