const utils = require('./utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 实现css分离
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 这个插件作用是对单独抽离出来的css文件进行压缩
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true // 是否将插件信息打印到控制台
    })
  ]
}

module.exports = merge(commonConfig, prodConfig);
