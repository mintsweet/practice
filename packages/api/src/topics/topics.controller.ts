import { Controller, Post, Delete, Put, Get } from '@nestjs/common';

@Controller('topics')
export class TopicsController {
  @Get('/')
  queryList() {}

  @Post()
  create() {}

  @Delete(':id')
  remove() {}

  @Put(':id')
  update() {}

  @Get(':id')
  query() {}

  @Put(':id/star')
  star() {}

  @Put(':id/collect')
  collect() {}

  @Post(':id/reply')
  reply() {}
}
