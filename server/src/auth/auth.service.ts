import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { User } from './intefaces/user.interface';
import { SignInDto } from './dto/signin.dto';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { PassThrough } from 'stream';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ){}


  async createToken(user: JwtPayload): Promise<any> {
    return await this.jwtService.sign(user);
  }


  async signIn(user: SignInDto): Promise<any> {
   const userFound: User = await this.userService.searchUser(user);

    if(userFound){
      const pass = await bcrypt.compare(user.password, userFound.password);
      if(pass) {
        const payload: JwtPayload = {
          name: userFound.name,
          email: userFound.email
        }
        return await this.createToken(payload); 
      } else {
        throw new NotFoundException();
      }

    } else {
      throw new NotFoundException();
    }
  }

  async signUp(user: SignUpDto): Promise<any> {
    const userFound: User = await this.userService.searchUser(user);

    if(!userFound){
      const created = await this.userService.createUser(user);

      if(created){
        return await this.signIn(user);
      } else {
        throw new InternalServerErrorException();
      }

    } else {
      throw new ConflictException();
    }
  }

  async getData(user: SignInDto): Promise<any> {
    const payload: JwtPayload = {
      name: user.name,
      email: user.email
    }
    return payload;
  }

  async editUser(credentials: User, changes: EditUserDto): Promise<any> {
    return await this.userService.editUser(credentials, changes);
  }

  async validateEmail(email: string): Promise<any>{
    return await this.userService.validateEmail(email);
  }

  async validateName(name: string): Promise<any> {
    return await this.userService.validateName(name);
  }

  async validateUser(payload: JwtPayload){
    const user: SignInDto = {
      name: payload.name,
      email: payload.email,
      password: ""
    }

    return await this.userService.searchUser(user);
  }
}
