const Layer = require("./layer");
const methods = require('methods')

function Route() {
  // route也有一个stack，存放内层的layer（方法类型与用户传入函数的对应）
  this.stack = []
  this.methods = {}
}
/*
@ route有一个diapatch属性，调用一次执行内层的stack
@ 还有一个get方法，用来标记内层layer函数与方法类型的对应关系
*/
Route.prototype.dispatch = function(req, res, out) {
  let idx = 0
  const next = (err) => {
    if(err) { return out(err)} // out就是外层的next，如果内层有错误，直接跳出
    
    if (idx >= this.stack.length) return out()
    const routeLayer = this.stack[idx++]
    // 比较方法
    if (routeLayer.method ===  req.method.toLowerCase()) {
      routeLayer.handle(req, res, next)
    } else {
      next()
    }
  }
  next()
}
methods.forEach(method => {
  
  Route.prototype[method] = function(handles) {
    if(!Array.isArray(handles)){
      handles = [handles];
    }
    handles.forEach(handle => {
      const layer = new Layer('', handle)
      this.methods[method] = true
      layer.method = method
      this.stack.push(layer)
    });
  }

})



module.exports = Route