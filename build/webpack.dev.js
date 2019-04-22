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
    contentBase: resolve('./dist'), // 告诉服务器从哪个目录中提供内容
    compress: true, // 自动压缩
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    hotOnly: true // 尽管html功能没有实现，也不让浏览器刷新
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader', // 解析 @import and url()
          'postcss-loader', // 为 css 样式属性加不同浏览器的前缀
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: "css-loader", // 解析 @import and url()
            options:{
                importLoaders:2 ,// 如果sass文件里还引入了另外一个sass文件，另一个文件还会从postcss-loader向上解析。如果不加，就直接从css-loader开始解析。
                modules: true // 开启css的模块打包。css样式不会和其他模块发生耦合和冲突
            }
          }, 
          'postcss-loader', // 为 css 样式属性加不同浏览器的前缀
          'sass-loader' // 将 sass/scss 编译成 css
        ]
      },
    ]
  },
  optimization: { // 在开发环境中加，生产环境不加
    usedExports: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 使用模块热替换插件
  ]
}

module.exports = merge(commonConfig, devConfig);