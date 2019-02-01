import { Injectable, ConflictException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../intefaces/user.interface';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from '../dto/edit-user.dto';

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

  async editUser(user: User, changes: EditUserDto): Promise<any>{
    const check = {
      nameCheck: undefined,
      emailCheck: undefined,
      passwordCheck: undefined
    }
    const encryptedPass = changes.newPassword ? await bcrypt.hash(changes.newPassword, 10) : undefined; 

    if(changes.email) {
      const search = await this.validateEmail(changes.email);
      if(search) {
        return new ConflictException();
      }

      check.emailCheck = true;
    } 

    if(changes.name) {
      const search = await this.validateName(changes.name);
      if(search) {
        return new ConflictException();
      }
      check.nameCheck = true;
    }

    if(changes.oldPassword && changes.newPassword){
      const userSearch = await this.searchUser(user);
      const checkPassword = await bcrypt.compare(changes.oldPassword, userSearch.password);
      if(checkPassword) {
        check.passwordCheck = true;
      } else {
        return new UnauthorizedException();
      }
    }
    
    if(check.passwordCheck) {
      await this.userSchema.updateOne({ email: user.email }, { password: encryptedPass });
    }
    if(check.emailCheck) {
      await this.userSchema.updateOne({ email: user.email }, { email: changes.email });
    }
    if(check.nameCheck) {
      await this.userSchema.updateOne({ name: user.name }, { name: changes.name });
    }
    
    return HttpStatus.OK;
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
