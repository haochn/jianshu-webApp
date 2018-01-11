//引入文件模块
const fs = require('fs');

//设置获取数据的方法

exports.getData = function() {
    const content = fs.readFileSync('./mock/data.json', 'utf-8');
    return content;
}