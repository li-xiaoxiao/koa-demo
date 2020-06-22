const express = require('./lib/index');
// const express = require('express');

const app = express();
app.use('/', (req, res, next) => {
  // todo
  console.log(1)
  next()
})

app.use('/', (req, res, next) => {
  // todo
  console.log(2)
  next()
})
app.use('/', (req, res, next) => {
  // todo
  console.log(3)
  next()
})
// 路由的中间件  将处理逻辑 拆分成一个个的模块
app.get('/', function(req, res, next) {
    console.log(1)
    next()
}, function(req, res, next) {
    next();
    console.log(11)
}, function(req, res, next) {
    next('出错了');
    console.log('出错了');

})
app.get('/', function(req, res, next) {
    console.log('2');
    res.end('end')
})
app.post('/', function(req, res, next) {
  res.end('post ok')
})
app.use((err,req,res,next)=>{ 
  next();
})

app.listen(3001, () => {
    console.log('server start 3000');
})