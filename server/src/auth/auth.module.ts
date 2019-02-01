import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

const keys = require('../config');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: keys.jwtKey,
      signOptions: {
        expiresIn: 30 * 24 * 60 * 60 * 1000
      }
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
