# practice-client

> 首发web版客户端，为了快速迭代初始UI使用 Antd-mobile 后期可能会改为我自己的UI。

## 快速开始

  - 执行 npm install 或者 yarn 安装依赖
  - [启动数据端](/server/README.md)
  - 执行 npm start 或者 yarn start
  - 打开`http://localhost:3001`

## 目录结构

  所有代码皆存放在`src`目录下.

  - common: 路由的配置 
  - components: 公共组件(类似底部导航之类的)
  - layouts: 布局(分主体布局和账户相关布局)
  - routes: 实际的页面(内部子菜单皆为)
  - service: API相关接口，请求的方法，请求的基础地址
  - store: redux相关内容
  - App.js: 入口
  - index.css: 公共样式表
  - index.js: React 入口

## 客户端相关文章
