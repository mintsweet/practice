# 快速开始

本篇针对小小白讲述一下项目环境、应该如何开启各个项目。

## 环境

  - node: `v10.5.0`
  - mongodb: `v3.6.3`
  - redis: `v4.0.10`

这个没有装的...或者不会装的...那就搜一下？这里版本号和`readme`可能有所不同哈，由于我自己的原因，电脑常常不是同一台，上述为我家用环境。

## 项目

数据端(Server)作为其他所有客户端的数据服务，也就是说不管你要玩`Site`又或是`Manage`都需要首先开启`Server`。

### 安装依赖

  - 如果你用的是`yarn`，直接在根目录下运行`yarn`就会把所有包的依赖的安装上。
  - 如果你用的是`npm`，那好吧，你还是装`yarn`参照上述...开玩笑的，你可以进到你需要的包，比如`cd server`然后在执行`npm install`，不过这样需要每个包都执行一次。

### 更改配置文件

在项目的根目录下有一个`config.default.js`文件，使用者可以根据需求修改其中的内容，比如各个包开启的端口号等等，我也会尽量保证项目的可配置性。

### 开启服务

由于每个项目都是可以独立存在的，他们分别需要运行在不同的服务下，每个包都有一个启动命令`yarn start`或者是`npm start`用于启动当前服务。

### 服务测试

由于时间的原因导致我可能不会在每个包都加入单元测试，不过`Server`对于整个项目来说还是比较重要，所以肯定是会有单元测试的，也希望大家能够帮忙书写一些测试。

## 其他

如若你有任何问题或者想法都可以在`issue`中提出，请不要恶意灌水谢谢！

**开源不易，且行且珍惜！！！**