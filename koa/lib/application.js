const EventEmitter = require('events')
const http = require('http')
const context = require('./context.js')
const request = require('./request.js')
const response = require('./response.js')
const Stream = require('stream')

class Application extends EventEmitter {
  constructor() {
    super()
    // 为了实现每new一次有个全新的额context，因此需要使用object.create()赋值一份
    this.context = Object.create(context)
    this.response = Object.create(response)
    this.request = Object.create(request)
    this.middlewares = []
  }
  
  use(middleware) {
    this.middlewares.push(middleware)
  }
  generateContext(req, res) {
     // 保证每次use都创建新的上下文
    let context = Object.create(this.context);
    let request = Object.create(this.request);
    let response = Object.create(this.response);
    // 上下文中有一个request对象 是自己封装的的对象
    context.request = request;
    context.response = response;
    // 上下文中还有一个 req属性 指代的是原生的req
    // 自己封装的request对象上有req属性
    context.request.req = context.req = req;
    context.response.res = context.res = res;
    return context;
  }
  compose(ctx) {
    // 返回的是一个大的promise
    const dispatch = i => {
      try {
        if (i === this.middlewares.length) return Promise.resolve()
        const middleware = this.middlewares[i]
        return Promise.resolve(middleware(ctx, () => dispatch(i+1)))
      } catch(e) {
        console.log(e, 'e')
      }
    }
    return dispatch(0)
  }
  handleRequest(req, res) {
    // 根据req,res以及新的context生成一个ctx
    const ctx = this.generateContext(req, res)
    // 执行中间件
    this.compose(ctx).then(() => {
      // 对返回的处理
      let body = ctx.body; //当组合后的promise完成后，拿到最终的结果 响应回去

      if(typeof body == 'string' || Buffer.isBuffer(body)){
          res.end(body);
      }else if(body instanceof Stream){
          res.setHeader('Content-Disposition',`attachement;filename=${encodeURIComponent('下载1111')}`)
          body.pipe(res);
      }else if(typeof body == 'object'){
          res.end(JSON.stringify(body));
      }
    })
  }
  listen(...args) {
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}
module.exports = Application

// 状态码的处理） （文件找不到怎么处理）