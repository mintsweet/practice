# Server

> 基于 Koa 和 Mongodb 构建的数据服务。

## 简介

此包可以单独使用，可作为任何项目的数据依赖，所有接口都有详细描述。

## 重点说明

主分支上所有`API`已经改用`Koa`完成重写，如想继续使用`Express`，请切换到`server-express`分支，但是`server-express`分支不再新增`API`，只做`bug`修复，也就是从`v2`版本开始，新增`API`还是从主分支体现。

## 依赖版本

版本是我当前开发环境的版本，大家尽量保持大于等于这个版本吧...

  - Node: `v8.11.3`
  - Mongodb: `v3.6.4`
  - Redis: `v3.0.504`

## 快速开始

  1. 启动 Mongodb 和 Redis 的服务
  2. 执行 npm install 或者是 yarn 安装依赖
  3. 执行 npm start 或者是 yarn start
  4. 检查服务是否开始，浏览器访问 http://localhost:3000/api 是否有返回JSON。

## API文档

[使劲戳API文档](../API.md)

## 图片上传相关

关于图片上传功能依托于七牛云，使用者需首先申请七牛的开发者key，替换掉在`config.default.js`中的这一部分：

```javascript
qiniu: {
  ACCESS_KEY: '',
  SECRET_KEY: '',
  BUCKET_NAME: '',
  DONAME: ''
},
```

分别对应你七牛云的`accessKey`、`secret_key`、`存储空间名称`和`存储空间域名`。
