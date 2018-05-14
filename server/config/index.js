/*
* 配置
*/
const config = {
  
  port: 3000,

  mongodb: 'mongodb://localhost/practice',

  session: {
    key: 'practice',
    secret: 'practice',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2592000000,
    }
  },

  tabs: [
    {
      name: '技术',
      path: 'tech',
      children: [
        { name: '前端', path: 'frontend' },
        { name: '程序员', path: 'programmer' }
      ]
    },
    {
      name: '城市',
      path: 'city',
      children: [
        { name: '北京', path: 'beijing' },
        { name: '上海', path: 'shanghai' },
        { name: '广州', path: 'guangzhou' },
        { name: '深圳', path: 'shenzhou' },
        { name: '杭州', path: 'hangzhou' },
        { name: '成都', path: 'chengdu' },
        { name: '南京', path: 'nanjing' },
        { name: '武汉', path: 'wuhan' },
        { name: '重庆', path: 'chongqing' },
        { name: '西安', path: 'xian' }
      ]
    }
  ]
};


module.exports = config;