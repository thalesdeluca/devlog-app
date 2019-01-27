import { Controller, Post, Get, Body, Query, Res, Req } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from './user.service';
import { User } from './interface/user.interface';
import { GetUserDto } from "./dto/get-user.dto";
import { EditUserDto } from "./dto/edit-user.dto";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}

  @Post() 
  createUser(@Body() user : CreateUserDto, @Req() req) {
    const encodedCookie = this.userService.createUser(new User(user.name, user.email));
    //req.session.cookie
  }

  @Get(":id")
  findUser(@Query() params : GetUserDto) {
    return this.userService.getUser(params.id);
  }

  @Post(":id")
  editUser(@Query() params : EditUserDto) {
    console.log()
  }
}