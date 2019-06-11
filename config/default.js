const defaultConfig = {
  // 监听端口
  SERVER_PORT: 3000,

  // 数据库连接地址
  DB_PATH: 'mongodb://localhost:27017/practice',

  // redis 配置
  redis: {
    HOST: '',
    PORT: '',
    DB: '',
    PASSWORD: '',
  },

  // JWT 参数
  jwt: {
    secret: 'practice',
    expirse: 30 * 60 * 1000,
    refresh: 3 * 24 * 60 * 60 * 1000,
  },

  // 话题分类
  tabs: [
    { name: '分享', tag: 'share' },
    { name: '问答', tag: 'ask' },
    { name: '招聘', tag: 'job' },
  ],

  // 七牛图片上传
  // 不设置时，图片默认上传到服务器
  qn: {
    ACCESS_KEY: '',
    SECRET_KEY: '',
    BUCKET_NAME: '',
    DONAME: '',
    ZONE: '',
  },

  // 上传文件大小限制 单位(B) 默认 512KB
  FILE_LIMIT: 1024 * 1024 * 0.5,

  // 邮件配置
  mail: {
    HOST: '',
    PORT: 465,
    SECRET: true,
    AUTH: {
      user: '',
      pass: '',
    },
  },

  // 接口限制
  limit: {
    POST_CREATE: 100,
    REPLY_CREATE: 1000,
  },

  // 网站设置
  site: {
    name: 'Mints - 薄荷糖社区',
    description: '简洁、快乐的交流社区',
    keywords: 'mints, community',
    author: '青湛(github/mintsweet)',
    icon: '/static/img/favicon.ico',
  },

  // 客户端端口号
  CLIENT_PORT: 3001,

  // 接口地址
  API: 'http://localhost:3000',

  // 是否允许注册
  ALLOW_SIGNUP: false,

  // GitHub 鉴权配置
  github: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    CALLBACK_URL: '',
  }
};

module.exports = defaultConfig;
