# Server

> 基于 Express 和 Mongodb 构建的数据服务。

## 简介

此包可以单独使用，可作为任何项目的数据依赖，所有接口都有详细描述。

## 强调

**Express**版本的API不会新增了...也就是说以后关于此版本的API只做Bug修复，所以新增API都在`Koa`版本中体现。

## 版本

版本是我当前开发环境的版本，大家尽量保持大于等于这个版本吧...

  - Node: `v8.11.3`
  - Mongodb: `v3.6.4`
  - Redis: `v3.0.504`

## 快速开始

  1. 启动 Mongodb 和 Redis
  2. 执行 npm install 或者是 yarn 安装依赖
  3. 执行 npm start 或者是 yarn start
  4. 检查服务是否开始，浏览器访问 http://localhost:3000/api 是否有返回JSON。

## API文档

[使劲戳API文档](../API.md)

## 测试覆盖率

![测试覆盖率](./screenshots/test_cover.jpg)

## 超级管理员

在`models/data/root.js`文件中可修改初始化数据库时的超级管理员用户。
