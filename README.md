# practice

React + Vue + React-Native + Electron + Express + MongoDB => 构建技术社区

> 可能花费的时间会很多，我尽量在今年之内完成。(start一下 ---- 谢谢..)

## 简介

本篇对整个项目做一个统筹性的说明，我会在每个子包(也就是单独的项目中)进行项目的详细说明，想查看详细说明可到各个子包下面的`README.md`进行查看，如果是你想了解我学习的历程、本项目的开发过程和心得、与我一起成长，可以拉到文末查看我开发过程的博客，我可能会边做边写，也可能会做一大段在写，希望大家能耐心等待。

## 快速开始

所有对用户的端均需依赖于数据端，所有数据皆从数据端获取。也就意味着，如果你只看网页客户端(client)，你不止需要启动client，也需启动server，其他皆是如此，每端详情到各个目录下查看`README.md`。

  - [基于 Node 的后台数据端(server)](/server/README.md)

## 开发环境

  - `Node`：     `>= 8.0.0`
  - `MongoDB`：  `>= 3.4.0`

## 数据API文档

  - [公共模块](server/doc/common.md)
  - [用户模块](server/doc/user.md)
  - [文章模块](server/doc/post.md)
  - [分类模块](server/doc/gener.md)
  - [心情模块](server/doc/mood.md)
  - [管理员模块](server/doc/admin.md)

## 项目博客

在做这个实战项目的过程中，我还是把每一步都记录了下来给大家参照，也方便大家学习。

  - 终极实战(一) - 基于 Express 和 MongoDB 的数据服务实现

## 其他

本项目的问题你可以提[issue](https://github.com/mintsweet/practice/issues/new)或者给我发邮件。<br>
其他无关问题你可以在[segmentfault](https://segmentfault.com/u/qingzhan)给我提问。<br>

## 协议

practice &copy; [青湛](https://github.com/mintsweet), Released under the [MIT](./LICENSE) License.