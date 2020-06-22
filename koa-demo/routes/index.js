let articleRouter = require('./articleRouter');
let userRouter = require('./userRouter');
let combineRoutes = require('koa-combine-routers');

// 自己思考咋实现的
module.exports = combineRoutes(articleRouter,userRouter)