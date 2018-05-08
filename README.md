# practice

React + React-Router + Redux + React-Native + Electron + Express + MongoDB => 构建技术社区(涵盖 IOS Andriod App, 网页版客户端, 网页版管理端, 桌面版应用 , 数据端)

> 简介已经说得很清楚了嘛，一个项目包含整整六个子项目，每一个都能自成为一个项目，但是我觉得麻烦，就放在一起了，整体以 React 为基础，一整套 React 技术栈的实践，可能花费的时间会很多，我尽量在今年之内完成。(start一下 ---- 谢谢..)

## 简介

现如今前端的技术层出不穷，每个人都有选择不同技术的权利，我更加钟爱`react`一些，所以采用了如题的技术栈，做一个功能比较完善的技术社区。

本篇对整个项目做一个统筹性的说明，我会在每个子包(也就是单独的项目中)进行项目的详细说明，想查看详细说明可到各个子包下面的`README.md`进行查看，如果是你想了解我学习的历程、本项目的开发过程和心得、与我一起成长，可以拉到文末查看我开发过程的博客，我可能会边做边写，也可能会做一大段在写，希望大家能耐心等待。

## 快速开始

所有对用户的端均需依赖于数据端，所有数据皆从数据端获取。也就意味着，如果你只看网页客户端(client)，你不止需要启动client，也需启动server，其他皆是如此，每端详情到各个目录下查看`README.md`。

  - [依赖数据源数据端(server)](/server/README.md)
  - [移动端网页客户端(client)](/client/README.md)
  - [电脑端网页管理端(manage)](/manage/README.md)
  - [移动端 RN APP端(native)](/native/README.md)
  - [桌面端 Electron(electron)](/electron/README.md)
  - [移动端微信小程序(weapp)](/weapp/README.md)

## 开发环境

  - `Node`：     `>= 8.0.0`
  - `MongoDB`：  `>= 3.4.0`

## 数据API文档

[使劲戳这里戳这里](server/API.md)。

## 项目博客

在做这个实战项目的过程中，我还是把每一步都记录了下来给大家参照，也方便大家学习，首发皆在我本人`Github`，本仓库有关于`react`的代码也是为了[target](https://github.com/mintsweet/target)仓库而创，如果你想跟我学`react`，来`target`仓库一探。

### 个人博客地址

[React终极实战(一)-原型设计和数据模型](https://github.com/mintsweet/target/issues/1)<br>
[React终极实战(二)-API设计说明与数据端初始化](https://github.com/mintsweet/target/issues/2)<br>
[React终极实战(三)-完成客户端用户模块](https://github.com/mintsweet/target/issues/3)<br>

### segmentfault地址

[React终极实战(一)-原型设计和数据模型](https://segmentfault.com/a/1190000013249174)

## 其他

本项目的问题你可以提[issue](https://github.com/mintsweet/practice/issues/new)或者给我发邮件。<br>
其他无关问题你可以在[segmentfault](https://segmentfault.com/u/qingzhan)给我提问。<br>


## 协议

practice &copy; [qingzhan](https://github.com/mintsweet), Released under the [MIT](./LICENSE) License.