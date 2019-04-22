'use strict'

const path = require('path');

module.exports = {
  dev: {
    // path
    assetsSubDirectory: 'static', // 资源子目录
  },
  build: {
    // path
    assetsRoot: path.resolve(__dirname, '../dist'), // 资源目录
    assetsSubDirectory: 'static', // 资源子目录

  }
}