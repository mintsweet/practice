const path = require('path');

module.exports = {
  devServer: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
          '/api': '/'
        }
      }
    }
  },

  css: {
    loaderOptions: {
      postcss: {
        options: {
          config: path.join(__dirname, './postcss.config.js')
        }
      },
      less: {}
    }
  }
};
