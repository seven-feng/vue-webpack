const path = require('path');
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动创建html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 实现css分离
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 这个插件作用是对单独抽离出来的css文件进行压缩
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 每次构建前清理输出目录
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

function resolve(_path) {
  return path.join(__dirname, '..', _path);
}

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',  //当js文件更改， [hash]的值会变化，每次build会生成一个新的js文件，[hash:8]，只显示8位的hash值，打包出来当然文件名叫 bundle.js
    path: path.resolve(__dirname, '../dist') // resolve() 可以把相对路径解析成绝对路径， __dirname 是当前目录，路径必须是一个绝对路径，相对于根目录
  },
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
  module: { // 模块loader 默认是从右到左，从下到上执行,多个loader需要一个数组，loader是有顺序的，默认是从右向左执行，loader还可以写成对象方式
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 把样式都抽离成一个单独的css文件
          'css-loader', // 解析 @import and url()
          'postcss-loader', // 为 css 样式属性加不同浏览器的前缀
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      {
        test: /\.html$/,
        use: 'html-withimg-loader' // 解决html引入图片打包的问题
      },
      {
        test: /\.(png|jpe?g|gif|bmp|svg)$/i, // i 不区分大小写
        use: [ // 做一个限制，当我们的图片，小于多少k的时候，用base64来转化，否则用file-loader产生真实的图片
          { 
            loader: 'url-loader',
            options: {
              name: utils.assetsPath('img/[name].[hash:8].[ext]'), // 打包后的图片名字，后缀和打包的之前的图片一样
              limit: 8192 // 小于8192b，就可以转化成base64格式，大于就会打包成文件格式
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: utils.assetsPath('fonts/[name].[hash:8].[ext]'),
          limit: 8192
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: { // 压缩html文件
        removeAttributeQuotes: true, // 删除html文件的双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true,
      // favicon: resolve('favicon.ico')
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(), // 使用模块热替换插件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: utils.assetsPath('css/[name].[hash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[hash:8].css')
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true // 是否将插件信息打印到控制台
    }),
    new VueLoaderPlugin()
  ]
}