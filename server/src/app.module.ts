import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

const keys = require('./config');

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(keys.mongoURI)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
