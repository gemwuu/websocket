'use strict'
/**
* @author: ke.wu
* @create_time: 2016-06-24 16:24:20
* @file_name: http_page.js
* @description: HTTP 页面
 **/

const nunjucks = require('nunjucks')
const request = require('../util/request')
const config = require('../config/config')
const renderer = require('./renderer')
const co = require('co')
const login = require('../util/login')
const dt = require('../util/datetime')
const uuid = require('uuid')


// nunjucks settings
const tplPath = require('path').resolve(config.templatePath)
// nunjucks 和前端框架 vuejs 冲突，更改 nunjucks 的默认语法
let nj = nunjucks.configure(tplPath, {
  tags: {
    blockStart: '{%',
    blockEnd: '%}',
    variableStart: '{=',
    variableEnd: '=}',
  },
  watch: true
});

// handlers
module.exports = {
  index: function *(next) {
    yield next

    this.body = nj.render('page/index.html', {
      id: uuid.v4()
    })
  },
  test: function* (next) {
    yield next

    this.body = nj.render('page/test.html')
  }
}

