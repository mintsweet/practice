# Server

> 基于 Express 和 Mongodb 构建的数据服务。

## 简介

此包可以单独使用，可作为任何项目的数据依赖，所有接口都有详细描述。

## 快速开始

  1. 启动 Mongodb 服务
  2. 执行 npm install 或者是 yarn 安装依赖
  3. 执行 npm start 或者是 yarn start
  4. 检查服务是否开始，浏览器访问 http://localhost:3000/api 是否有返回JSON。

## API文档

[使劲戳API文档](../API.md)

## 测试覆盖率

![测试覆盖率](./screenshots/test_cover.jpg)

## 超级管理员

在`models/data/root.js`文件中可修改初始化数据库时的超级管理员用户。

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

