import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import UserSchema from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: 'user', schema: UserSchema}])],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}