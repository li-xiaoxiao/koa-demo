class UserController {
  async add(ctx, next) {
     await ctx.render('index.html',{name:'zf',age:11})
  }
  async remove(ctx, next) {
      await ctx.render('a.html',{name:'zf',age:11})
  }
}
module.exports = UserController