const Koa = require('koa');
const Router = require('koa-router')
const app = new Koa();
const router = require('./routes/index'); // 引入路由
const views = require('koa-views');

const cors = require('koa-cors');



app.use(cors());
app.use(views(__dirname + './views', {
  map: {
    html: 'ejs'
  }
}))

app.use(router());
app.listen(3000);
