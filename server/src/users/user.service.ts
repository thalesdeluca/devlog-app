import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  createUser(user : User) {
    this.users.push(user);
  }

  getUser(id){
    return this.users;
  }

}