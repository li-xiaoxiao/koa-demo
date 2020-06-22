/* 
  @router有route属性和layer属性，layer存路径和route.dispatch的对应关系，route存放用户真实的回调
  @ router是真个路由系统，route是一条条的路由
  @ 在express的路由系统中，又一个外层的栈，存放着路径与回调函数的对应关系，这个回调函数是route的diapatch，
  @ 当调用外层的handle时，会让route.dispatch执行，dispatch找到route中存放的layer，根据方法进行匹配，一次执行
  @ 内层的layer存放的是方法类型与真实回调的对应关系
*/
const Layer = require('./layer')
const Route = require('./route')
const url = require('url')
const methods = require('methods')

function Router() {
  const router = (req, res, next) => {

  }
  router.stack = []
  router.__proto__ = proto
  return router
}
let proto = {}
proto.route = function (path) {
  const route = new Route() // 创建route
  const layer = new Layer(path, route.dispatch.bind(route)) // 创建外层layer
  layer.route = route // 为layer设置route属性
  // 将layer存放到路由系统的stack中
  this.stack.push(layer)
  return route
}
// 遍历增加各种放大
methods.forEach(method => {
  proto[method] = function (path, handlers) {
    // 当调用get时我们创建一个layer，给他添加对应关系
    // 创建对应关系
    const route = this.route(path)
    // 让route调用get方法标记route中的每个layer是何种方法
    route[method](handlers)
  }
})
proto.use = function(path, ...handles) {
  if(typeof path == 'function') {
    // 只传递了一种参数
    handles.unshift(path)
    path = '/'
  }
  // 遍历handles创建layer
  handles.forEach(handle => {
    let layer = new Layer(path, handle)
    // 对于中间件，没有route属性，为了区分，设置route属性为undeinfed，并且把这个layer放入到路由系统中
    layer.route = undefined
    this.stack.push(layer)
  })
}
// router中有get方法与handle放法
proto.handle = function (req, res, done) {
  /*
    @ 当有请求过来时，我们先拿到path找到外层的layer，然后执行他的handle,让内层的route，根据method依次执行内层的layer的handle
    @
  */
  let { pathname } = url.parse(req.url)
  let idx = 0
  let removed = '';
  let next = (err) => {
    // 在这里进行统一的监听
    if (idx >= this.stack.length) return done() // 遍历完后还是没找到，那就直接走出路由系统即可
    let layer = this.stack[idx++]
    if (removed) {
      req.url = removed + pathname;// 增加路径 方便出来时匹配其他的中间件
      removed = '';
    }
    if (err) { //错误处理。一般放在最后
      // 进入到错误可以是中间件也可以是路由
      if (!layer.route) {
        // 找中间件
        layer.handle_error(err, req, res, next)
      } else {
        // 路由，继续携带错误信息匹配中间件
        next(err)
      }

    } else {
      // 需要查看 layer上的path 和 当前请求的路径是否一致，如果一致调用dispatch方法
      if (layer.match(pathname)) {
        // 当匹配到路径的后，可能为中间件，可能为路由
        if (!layer.route) {
          // 中间件的化，直接去执行
          // 排除错误中间件
          if (layer.handle.length !== 4) {
            if (layer.path !== '/') {
              removed = layer.path // 中间件的路径
              req.url = pathname.slice(removed.length);
            }
            layer.handle_request(req, res, next) // 普通中间件
          } else {
            // 是错误中间件，跳出
            next()
          }
        } else {
          // 路由
          if (layer.route.methods[req.method.toLowerCase()]) {
            layer.handle(req, res, next) // 将遍历路由系统中下一层的方法传入
          } else {
            next()
          }
  
        }
        // 路径匹配到了 需要让layer上对应的dispatch执行
      } else {
        next()
      }
    }
  }
  next()
}
module.exports = Router
