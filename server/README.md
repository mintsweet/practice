# practice-server

> 所有包的数据依赖，此练习的server端，技术栈Express + Mongodb

## 快速开始

  - 启动 Mongodb 服务
  - 执行 npm install 或者是 yarn 安装依赖
  - 执行 npm start 或者是 yarn start
  - 检查服务是否开始，浏览器打开[本地址](http://localhost:3000/api)是否有返回一串JSON

## API说明

以`http://localhost:3000/api`为基础路径，详情见[API详细说明](API.md)。


公共模块：

  - 获取手机验证码：/common/msgcaptcha

用户模块：

  - 用户登录：/user/signin
  - 用户注册：/user/signup
  - 用户找回密码：/user/forget 

文章模块：

  - 获取头条文章：/post/top
  - 获取文章列表：/post/list
  - 获取文章详情：/post/:id

分类模块：

  - 获取分类列表：/gener/list
  - 获取分类下文章列表：/gener/:id/posts

心情模块：

  - 获取心情列表：/mood/list
  - 获取心情详情：/mood/:id

管理员模块：

  - 管理员登录：/admin/signin
  - 管理员申请：/admin/signup