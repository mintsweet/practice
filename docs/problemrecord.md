# 踩坑记录

### 使用 vant 的时候用`babel-plugin-import `方式引入组件会报错，报错信息为 No postcss config in node_modules/vant/.... 

解决办法，在项目中手动创建`postcss.config.js`，在`vue.config.js`中手动指定`postcss`的配置文件

```javascript
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        options: {
          config: path.join(__dirname, './postcss.config.js')
        }
      }
    }
  }
}
```
