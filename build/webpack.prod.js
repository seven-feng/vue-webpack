const utils = require('./utils');
const config = require('./config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 实现css分离
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 这个插件作用是对单独抽离出来的css文件进行压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // js 压缩
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
  },
  module: {
    rules: [
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
          MiniCssExtractPlugin.loader, // 把样式都抽离成一个单独的css文件
          {
            loader: "css-loader", // 解析 @import and url()
            options:{
              importLoaders: 2 , // 如果sass文件里还引入了另外一个sass文件，另一个文件还会从postcss-loader向上解析。如果不加，就直接从css-loader开始解析。
              modules: true // 开启css的模块打包。css样式不会和其他模块发生耦合和冲突
            }
          }, 
          'postcss-loader', // 为 css 样式属性加不同浏览器的前缀
          'sass-loader' // 将 sass/scss 编译成 css
        ]
      },
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ]
}

module.exports = merge(commonConfig, prodConfig);
