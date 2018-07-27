# CHANGELOG

#### 说明

  * 文档本身对所有包进行更新说明。
  * 每周都会进行日常`bug`修复。

---

## v1.2.0

`2018-07-27`

### server

  - 改用`redis`为`session`存储库
  - 移除`controllers`中所有的数据库操作到`proxy`中
  - 更改模型`behavior`为`action`
  - 更改控制器`captcha`为`aider`
  - 由于移除`formidable`的原因，去除头像上传 API，此API与`Koa`版本中添加
  - 移除`controllers`中公共处理部分`base`
  - 修改部分 API 请求地址，详见 API 文档

## v1.1.0

`2018-07-24`

### server

  - 改为统一的异常处理
  - 修复一些问题、更新了对应的测试模块
  - 新增API**用户头像图片上传**(说明：此API需要使用者手动修改七牛开发者key使用)
  - 修复评论相关API问题

### site

  - 修复一些逻辑、样式和页面问题
  - 添加了屏幕截图

## v1.0.0

`2018-07-19`

### server

  - 初始化**37**个基础API

### site

  - 初始化服务端对应的页面
