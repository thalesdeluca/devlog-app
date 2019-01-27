import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './configuration/config.module';
import { UserModule } from './users/user.module';
import { AppController } from './app.controller';
const keys = require('config/default');

@Module({
  imports: [
    MongooseModule.forRoot(keys.mongoURI),
    ConfigModule,
    UserModule
  ],
  controllers: [AppController]
})

export class AppModule {}
