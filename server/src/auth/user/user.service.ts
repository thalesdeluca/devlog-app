import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../intefaces/user.interface';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userSchema: Model<User>){}

  async searchUser(user: SignInDto): Promise<any>{
    if(user.name){
      return await this.userSchema.findOne({ name: user.name });
    } else {
      return await this.userSchema.findOne({ email: user.email });
    }
  }

  async createUser(user: SignUpDto): Promise<any> {
    const encryptedPass = await bcrypt.hash(user.password, 10);

    const created = await new this.userSchema({
      name: user.name,
      email: user.email,
      password: encryptedPass
    }).save();
    return created;
  }

  async validateName(name: string): Promise<any> {
    const user = await this.userSchema.findOne({ name: name });
    if(user){
      return true;
    }

    return false;
  }

  async validateEmail(email: string): Promise<any> {
    const user = await this.userSchema.findOne({ email: email });
    if(user){
      return true;
    }

    return false;
  }
   
}
