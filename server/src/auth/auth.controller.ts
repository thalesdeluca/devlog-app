import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpStatus, Put } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signin.dto';

/*TODO: edit name
  TODO: project Routes*/
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('signup')
  async signUp(@Body() user: SignUpDto, @Res() res) {
    const token = await this.authService.signUp(user);
    res.headers.authorization = "jwt " + token;
    return HttpStatus.OK;
  }
  
  @Get('data')
  @UseGuards(AuthGuard())
  async getData(@Req() req){
    console.log(req.headers.authorization);
    return await this.authService.getData(req.user);
  }

  @Post('signin')
  async signIn(@Body() user: SignInDto){
    return await this.authService.signIn(user)
  }

  @Put("edit")
  async editName(){

  }
  

}
