const koa = require('koa');
const controller = require('koa-route');
const app = koa();
//支持ejs模板解析
const views = require('co-views');

const render = views('./views', {
    map: { html: 'ejs' }
});

//路由引入
const koa_static = require('koa-static-server');

const service = require('./service/service');

//引入queryString 
const qs = require('querystring');

//路由的配置

//首页

app.use(controller.get("/", function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = yield render('index')
}))


//配置数据访问地址（api）

app.use(controller.get('/ajax/data', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.getData();
}))

//配置静态文件的访问地址

app.use(koa_static({
    rootDir: './static/', //实际静态文件的存放地址
    rootPath: '/static/',
    maxage: 0
}));

//模拟数据存放地址
app.use(koa_static({
    rootDir: './mock/', //实际静态文件的存放地址
    rootPath: '/mock/',
    maxage: 0
}));

//开启服务

app.listen(5000, function() {
    console.log('server running is http://localhost:5000');
})