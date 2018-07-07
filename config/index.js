// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const config = require('../config/config')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../views/admin/index.html'),
        assetsRoot: path.resolve(__dirname, '../public/dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/dist/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: require('./dev.env'),
        port: config.Client_Port,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': `http://localhost:${config.Server_Port}`
            // {
            //     target: `http://localhost:${config.Server_Port}`,
            //     changeOrigin: true,  //
            //     pathRewrite: {
            //         '^/apis': ''
            //     }
            // }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}