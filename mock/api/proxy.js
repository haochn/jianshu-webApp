var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var express = require('express');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
var app = express();
var cnodeUrl = 'http://m.zhuishushenqi.com/';

var globleData = {};

//设置路由 (首页频道)
app.get('/ajax/api', function(req, resp, next) {
    superagent.get(cnodeUrl)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(res.text);
            //所有区块
            var block = $(".c-book-recommend-section"),
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
                blockContent.items.push(girlContent)
            })
            console.log(blockContent)

            resp.send(blockContent);
            resp.end();




        });
});





app.get('/ajax/book', function(req, resp, next) {

    var id = req.url.split('?')[1].split("id=")[1];
    var cUrl = cnodeUrl + req.url.split('/ajax/')[1].split("?")[0] + '/' + id;
    superagent.get(cUrl)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }

            var $ = cheerio.load(res.text);

            //书籍页信息
            var bookDetail = $(".book-detail"),
                bookCover = bookDetail.find('.cover').attr('src'),
                bookTitle = bookDetail.find('h1').text(),
                author = bookDetail.find('.sku .c-red').text();
            var bookData = {};


            //人气
            var popularNum = $('.reader-data .item').eq(0).find("span").eq(1).text(),
                rate = $('.reader-data .item').eq(1).find("span").eq(1).text(),
                dayTime = $('.reader-data .item').eq(2).find("span").eq(1).text();


            //内容简介
            var content = $('.introduction p').text();
            bookData = {
                cover: bookCover,
                title: bookTitle,
                author: author,
                popularNum: popularNum,
                rate: rate,
                dayTime: dayTime,
                content: content
            }


            // block.each(function(index, ele) {
            //     var $ele = $(ele);


            // })


            console.log(bookData)
            resp.send(bookData);
            resp.end();
        });
});



app.listen(3000, function() {
    console.log('app is listening at port 3000');
});