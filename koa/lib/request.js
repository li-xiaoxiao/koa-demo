const url = require('url')
const request = {


  // 属性访问器,类似Object.definedProperty()
  get url() {
    // 这里的this指的是ctx.request
    return this.req.url
  },
  get path() {
    return url.parse(this.req.url).pathname
  },
  // 希望有什么属性就扩展
  get query() {
    return url.parse(this.req.url, true).query
  }
}
module.exports = request