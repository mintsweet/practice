const defaultConfig = {
  // 监听端口
  SERVER_PORT: 3000,

  // 数据库连接地址
  DB_PATH: 'mongodb://localhost:27017/practice',

  // redis 配置
  redis: {
    HOST: 'localhost',
    PORT: '6379',
    DB: 0,
    PASSWORD: '',
  },

  // 密码加密位数
  SALT_WORK_FACTOR: 10,

  // JWT 参数
  jwt: {
    SECRET: 'practice',
    EXPIRSE: 30 * 60 * 1000,
    REFRESH: 3 * 24 * 60 * 60 * 1000,
  },

  // 话题分类
  tabs: {
    share: '分享',
    ask: '问答',
    job: '招聘',
  },

  // 上传文件大小限制 单位(B) 默认 512KB
  FILE_LIMIT: 1024 * 1024 * 0.5,

  // 网站设置
  name: '薄荷糖社区',
  description: '简洁、快乐的交流社区',
  keywords: 'mints, community',
  author: '青湛(github/mintsweet)',

  // 头部默认菜单
  menus: [
    {
      name: '快速开始',
      url:
        'https://github.com/mintsweet/practice/wiki/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B',
    },
    { name: '文档', url: 'https://github.com/mintsweet/practice/wiki' },
  ],

  friend_links: [
    {
      logo: 'https://cnodejs.org/public/images/cnodejs.svg',
      link: 'https://cnodejs.org',
    },
  ],

  // 客户端端口号
  CLIENT_PORT: 3001,

  // 接口地址
  API: 'http://localhost:3000',

  // session 配置
  session: {
    SECRET: 'practice',
  },
};

module.exports = defaultConfig;
