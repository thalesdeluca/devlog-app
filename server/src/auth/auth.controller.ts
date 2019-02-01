import { Controller, Post, Body, Get, UseGuards, Req, Put, Query } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signin.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('signup')
  async signUp(@Body() user: SignUpDto, @Req() req) {
    const token = await this.authService.signUp(user);
    req.headers.authorization = "jwt " + token;
    return token;
  }
  
  @Get('data')
  @UseGuards(AuthGuard())
  async getData(@Req() req){
    return await this.authService.getData(req.user);
  }

  @Post('signin')
  async signIn(@Body() user: SignInDto){
    return await this.authService.signIn(user);
  }

  @Put("edit")
  @UseGuards(AuthGuard())
  async editUser(@Req() req, @Body() changes: EditUserDto){
    return await this.authService.editUser(req.user, changes);
  }

  @Post("email")
  async validateEmail(@Query("email") email) {
    return await this.authService.validateEmail(email);
  }

  @Post("name")
  async validateName(@Query("name") name) {
    return await this.authService.validateName(name);
  }
  

}
