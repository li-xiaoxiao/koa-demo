const http = require('http')
const Router = require('./router')
const methods = require('methods')
/*
  @ 在初始化application的时候，需要创建一个router实例，中间的请求处理都让router去完成
@*/

function Application() {
  // 在创建应用的时候，初始化一个router
}
Application.prototype.lazy_router = function() {
  if (!this._router) {
    this._router = new Router() // 在调用了对应的方法或者listen的创建路由
  }
}
methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_router()
    this._router[method](path, handlers) // 
  }
})
Application.prototype.use = function() {
  // 中间件的实现逻辑,只要用到路由就要判断一次路由是否加载
  this.lazy_router()
  // 将逻辑交给路由系统中实现
  this._router.use(...arguments)
}
Application.prototype.listen = function (...arg) {
  const server = http.createServer((req, res) => {
    this.lazy_router() // 实现路由的懒加载
    function done() {
      // 如果router处理不了，直接执行done
      res.end('not xx `Found')
    }
    this._router.handle(req, res, done)
  })
  server.listen(...arg)
}

module.exports = Application
