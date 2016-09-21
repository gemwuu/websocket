'use strict'
const app = require('koa.io')()
const router = require('koa-router')()
const logger = require('koa-logger')
const koaBody = require('koa-body')
const staticFile = require('koa-static')
const compress = require('koa-compress')
const dir = require('path')
const config = require('./config/config')

// local module of HTTP
const handlers = require('./service/http_page')
const services = require('./service/http_service')
const login = require('./util/login')

// local module of WEBSOCKET
const websocket = require('./service/websocket_service')

const port = config.port

// koa middleware
app.use(compress({
  filter: function (content_type) {
    return /text|image|javascript/i.test(content_type)
  },
  threshold: 1024,
  flush: require('zlib').Z_SYNC_FLUSH
}))
app.use(logger())
// 资源文件缓存 12 小时
app.use(staticFile(dir.resolve('../static/'), {
  maxage: 1000 * 60 * 60 * 12
}))
// 不能放到 router 下面，why? 好问题。
app.use(router.routes())

// 验证是否是移动端的中间件
app.use(function *(next) {
  let isMobile = false
  let userAgent = this.request.header['user-agent'].toLowerCase()
  if (userAgent.search(/android|iphone|ipad|windows\ phone/) >= 0) {
    isMobile = true
  }
  console.log('check whether the client is mobile: %s', isMobile)
  this.isMobile = isMobile
  yield next
})

// 验证是否登录中间件
app.use(function *(next) {
  let openid = this.cookies.get('openid')
  let url = this.request.url
  let userInfo, isLogged

  if (openid) {
    userInfo = yield login['checkLogin'](openid)
  }

  if (userInfo && userInfo.resultCode === 200) {
    isLogged = true
    this.isLogged = true
    this.openid = openid
    this.userInfo = userInfo.result
  } else {
    this.isLogged = false
    isLogged = false
    this.openid = ''
    this.userInfo = ''
  }
  console.log('check whether the visitor is logged: %s', this.isLogged)
  this.cookies.set('url', url)
  yield next
})

/*
 * route for web page and service
 * '*.html' for pages
 * '*' for interfaces
 * */
// 首页
router.get('/index.html', handlers.index)
router.get('/', handlers.index)

// 提交评论
router.post('/comment', koaBody(), services.comment)

// test.html
router.get('/test.html', handlers.test)

app.io.use(function* (next) {
  // on connect
  console.log('11111')
  this.emit('news', { a: 'b' })

  yield *next
  // on disconnect
  console.log('22222')
})

app.io.route('news', function *(next, test) {
  console.log(test)
  console.log('=======')
  this.emit('news', { hello: 'world'} )
})


// start server
app.listen(port, function() {
  console.log('server starts at %d', port)
})
