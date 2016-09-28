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
const userSet = new Set()
const users = []

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
  let id = this.cookies.get('id')
  if (id) {
    this.isLogged = true
    this.id = id
  } else {
    this.isLogged = false
  }

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
  yield next
  // on disconnect
})

app.io.route('new msg', function *(next, data) {
  // remove offline client
  //TODO
  for (var client in app.io.engine.clients) {
    if (client !== this.socket.id) {
      this.broadcast.to(client).emit('notification', data)
    } else {
      this.emit('notification', data)
    }
  }
})

app.io.route('new user', function *(next, data) {
  // remove offline client
  // TODO
  if (!userSet.has(data.id)) {
    userSet.add(data.id)
    users.push(data)
  } else {
    for (let i = 0, l = users.length; i < l; ++i) {
      if (users[i]['id'] === data.id) {
        users[i]['nickname'] = data.nickname
      }
    }
  }
  for (let client in app.io.engine.clients) {
    if (client !== this.socket.id) {
      this.broadcast.to(client).emit('new user', users)
    } else {
      this.emit('new user', users)
    }
  }
})

// start server
app.listen(port, function() {
  console.log('server starts at %d', port)
})
