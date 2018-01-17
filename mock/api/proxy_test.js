var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var koa = require('koa');
const controller = require('koa-route');
var app = koa();

//爬去页面的地址
var cnodeUrl = 'http://m.zhuishushenqi.com/';

app.use(controller.get('/ajax/data', function*() {

    let blockContent,
        req = superagent.get(cnodeUrl)
        .set('Cache-Control', 'no-cache')
        .type('application/json')
        .end(function(err, res) {

            if (err) {
                return console.error(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(res.text);
            // console.log(res.text)
            //所有区块
            var block = $(".c-book-recommend-section");
            blockContent = {
                items: [],
                status: 0
            };
            //女生区域
            var girlBlock = block.eq(0);

            block.each(function(index, ele) {
                var $ele = $(ele);
                var itemTitle = $ele.find('.title');
                var girlContent = { itemTitle: itemTitle.text(), data: [] };

                $ele.find('.c-book-recommend-list a').each(function(idx, element) {
                    var $element = $(element);
                    var bookName = $element.find(".name span");
                    var bookUrl = url.resolve(cnodeUrl, $element.attr('href'));
                    var bookContent = $element.find('.desc');
                    var tags = $element.find('.tag');
                    var cover = $element.find('.cover').attr('src');

                    girlContent.data.push({
                        title: "女生最爱",
                        name: bookName.text(),
                        url: bookUrl,
                        content: bookContent.text(),
                        tags: tags.text(),
                        cover: cover
                    });
                })
                blockContent.items.push(girlContent);
            })
        });
    req.send();
    that.body = blockContent;
}))

//设置路由 (首页频道)

app.listen(6000, function() {
    console.log('app is listening at port 6000');
});