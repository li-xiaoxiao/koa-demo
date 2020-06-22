let Router = require('koa-router');
const router = new Router({prefix:'/user'});  // 划分路由的作用域


let UserController = require('../controller/userController');

let user = new UserController();


router.get('/add',user.add)
router.get('/remove',user.remove)
module.exports = router;