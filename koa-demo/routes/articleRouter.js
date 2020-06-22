let Router = require('koa-router');
let ArticleController = require('../controller/articleController');

let article = new ArticleController();


const router = new Router({prefix:'/article'});  // 划分路由的作用域

// 命中路径后 调用对应的控制器来处理
router.get('/add',article.add)
router.get('/remove',article.remove)


module.exports = router;