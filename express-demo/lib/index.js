const Application = require('./application.js')
// 创建应用的逻辑与入口分离开
function createApplication() {
  return new Application()
}
// 提供一个Router类，既可以new也可以执行
createApplication.Router = require('./router')

module.exports= createApplication