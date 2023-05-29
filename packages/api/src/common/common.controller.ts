import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('')
export class CommonController {
  @Get('captcha')
  captcha() {}

  @Post('signup')
  signup() {}

  @Post('signin')
  signin() {}

  @Post('forget-pass')
  forgetPass() {}

  @Post('reset-pass')
  resetPass() {}

  @Get('/user')
  user() {}

  @Put('/settings')
  settings() {}

  @Put('/password')
  password() {}
}
