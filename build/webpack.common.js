const path = require('path');
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动创建html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 实现css分离
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 每次构建前清理输出目录
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(_path) {
  return path.join(__dirname, '..', _path);
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    filename: 'bundle.[hash:8].js',  // 当js文件更改， [hash]的值会变化，每次build会生成一个新的js文件，[hash:8]，只显示8位的hash值，打包出来当然文件名叫 bundle.js
    chunkFilename: '[name].chunk.js', // main.js异步加载的间接的js文件。用来打包import('module')方法中引入的模块
    path: path.resolve(__dirname, '../dist') // resolve() 可以把相对路径解析成绝对路径， __dirname 是当前目录，路径必须是一个绝对路径，相对于根目录
  },
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
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production'
          ? 'vue-style-loader'
          : MiniCssExtractPlugin.loader, // 把样式都抽离成一个单独的css文件
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
    // runtimeChunk: 'single',
    runtimeChunk: { // 兼容老版本webpack4，把manifest打包到runtime里，不影响业务代码和第三方模块
			name: 'runtime'
		},
    splitChunks: { // 启动代码分割,不写有默认配置项
      chunks: 'all', // 参数all/initial/async，只对所有/同步/异步进行代码分割
      minSize: 30000, // 大于30kb才会对代码分割
      maxSize: 0,
      minChunks: 1, // 打包生成的文件，当一个模块至少用多少次时才会进行代码分割
      maxAsyncRequests: 5, // 同时加载的模块数最多是5个
      maxInitialRequests: 3, // 入口文件最多3个模块会做代码分割，否则不会
      automaticNameDelimiter: '~', // 文件自动生成的连接符
      name: true,
      cacheGroups:{ // 对同步代码走缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 谁优先级大就把打包后的文件放到哪个组
          filename: utils.assetsPath('js/vendors.js')
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 模块已经被打包过了，就不用再打包了，复用之前的就可以
          filename: 'common.js' // 打包之后的文件名   
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: { // 压缩html文件
        removeAttributeQuotes: true, // 删除html文件的双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true,
      favicon: resolve('favicon.ico')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: utils.assetsPath('css/[name].[hash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[hash:8].css')
    }),
    new VueLoaderPlugin()
  ]
}