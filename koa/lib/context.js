const context = {
}
// 代理方法
function defineGetter(target, key) {
  // 定义一个getter, context和this不是一个，this.__proto__.__proto__ = context
  context.__defineGetter__(key, () => {
    return this[target][key]
  })
}

function defineSetter(target, key) {
  context.__defineSetter__(key, (newValue) => {
    this[target][key] = newValue
  })
}
defineGetter('request', 'url')
defineGetter('request', 'path') 
defineGetter('request', 'query') // ctx.query = ctx.requesrt.query

defineGetter('response','body');// ctx.body => ctx.response.body
defineSetter('response','body');// ctx.body => ctx.response.body
module.exports = context