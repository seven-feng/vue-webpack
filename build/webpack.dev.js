const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

function resolve(_path) {
  return path.join(__dirname, '..', _path);
}

const devConfig = {
  mode: 'development',
  devServer: { // 开发服务器的配置，webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中
    port: 3000,
    progress: true, // 编译的进度条
    contentBase: resolve('dist'), // 告诉服务器从哪个目录中提供内容
    compress: true, // 自动压缩
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    hotOnly: true // 尽管html功能没有实现，也不让浏览器刷新
  },
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    usedExports: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 使用模块热替换插件
  ]
}

module.exports = merge(commonConfig, devConfig);