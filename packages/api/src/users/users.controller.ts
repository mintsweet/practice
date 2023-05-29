import { Controller, Get, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  query() {}

  @Get(':id/activies')
  activities() {}

  @Get(':id/topics')
  topics() {}

  @Get(':id/stars')
  stars() {}

  @Get(':id/collects')
  collects() {}

  @Get(':id/followers')
  followers() {}

  @Get(':id/followings')
  followeings() {}

  @Put(':id/follow')
  follow() {}
}
