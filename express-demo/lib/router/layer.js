function Layer(path, handle) {
  this.path = path
  this.handle = handle
}
Layer.prototype.match = function (pathname) {
  // 路由和中间件的匹配规则不同
  if (this.path === pathname) return true
  if (!this.route) {
    // 中间件
    if (this.path === '/') return true
    return pathname.startsWith(this.path + '/')
  }
  return false

}
Layer.prototype.handle_error = function(err, req, res, next) {
  // 找到错误处理中间件所在的layer,如果不是带着错误信息继续next
  if(this.handle.length === 4) {
    // 错误处理中间件,让handle执行
    return this.handle(err, req, res, next)
  }
  next(err) // 普通的中间件
}
Layer.prototype.handle_request = function(req, res, next) {
  this.handle(req, res, next)

}
module.exports = Layer