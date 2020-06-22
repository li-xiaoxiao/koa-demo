// const Koa = require('./koa')
// let app = new Koa()

// const logger = () => {
//   return new Promise(function(reslove, reject) {
//     console.log('logger')
//     reslove()
//   })  
// }
// app.use(async (ctx, next) => {
//   console.log(1)
//   next()
//   console.log(2)
//   console.log(9) 
// })
// app.use(async (ctx, next) => {
//   // next代表下一个中间件
//   console.log(3)
//   await next()
//   // await logger()
//   console.log(4)
//   console.log(8) 
// })
// app.use(async (ctx, next) => {
//   // next代表下一个中间件
//   console.log(5)
//   await next()
//   console.log(6)
// })
// app.on('error', (e) => {
//   console.log(e)
// })
// app.listen(3000)

const { fork } = require('child_process') // 专门用来开辟一个子进程
const child = fork('./timer.js') // 将脚本交给一个子进程去执行



// 模拟事件环
let macroTask = []
setInterval(() => { 
  // 在宏任务队列中拿出一个任务执行
  let task = macroTask.shift()
  task && task()
}, 16); // 浏览器一桢大概是16ms

function setTimeout2(callback, timeout) {
  child.send({ type: 'start', timeout}) // 向子进程发送相关的消息
  child.on('message', (message) => {
    // 监听子进程的消息
    if(message.ready) {
      macroTask.push(callback)
    }
  })
}
setTimeout2(() => {
  console.log(222)
}, 1000);
