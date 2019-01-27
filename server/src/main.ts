import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'cookie-session';

const keys = require('../config/default');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    keys: [keys.jwtKey],
    name: "session",
    maxAge: 30*24*60*60*1000
  }))
  await app.listen(3000);
}
bootstrap();
