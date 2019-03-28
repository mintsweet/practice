const path = require('path');

module.exports = {
  devServer: {
    port: 3003,
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:3000/',
    //     changeOrigin: true
    //   }
    // }
  },

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
