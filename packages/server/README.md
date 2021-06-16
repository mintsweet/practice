# Server

> 基于 Koa 和 Mongodb 构建的数据服务。

## 简介

此包可以单独使用，可作为任何项目的数据依赖，所有接口都有详细描述。

## 版本说明

主分支上的代码均由 `Koa` 书写，关于 `Express` 版本的 `API` 可查看 `server-express` 分支.

## 依赖版本

版本是我当前开发环境的版本，大家尽量保持大于等于这个版本吧...

  - Node: `v10.15.3`
  - Mongodb: `v4.0.3`

## 快速开始

  1. 启动 `Mongodb` 和 `Redis` 的服务
  2. 执行 `npm install` 或者是 `yarn` 安装依赖
  3. 执行 `npm start` 或者是 `yarn start`
  4. 检查服务是否开始，浏览器访问 `http://localhost:3000/api` 是否有返回JSON。
