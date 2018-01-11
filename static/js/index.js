$.get("/ajax/data", function(data) {

    console.log(data)
    new Vue({
        el: "#exam-content",
        data: {
            "chapter": data.data.chapter,
            "examData": data.data.examData
        }
    })


    let startBtn = $('.start-btn');
    let obj = {
        "judgeData": [],
        "selectData": []
    }
    let flag = true;
    let clearTime = null;
    let hourDom = $('.hour'),
        minuteDom = $('.minute'),
        secondDom = $('.second');
    //开始考试
    startBtn.click(function(e) {
        $('.exam-index').hide();
        $('.exam-wrap-judge').show();
        let time = 0;
        if (flag) {
            let _second, _minute, _hour;
            clearTime = setInterval(function() {
                time += 1;
                _hour = formatNumber(parseInt(time / 3600));
                _minute = formatNumber(parseInt(time / 60));
                _second = formatNumber(time % 60);
                //var _html = time > 9 ? time : '0' + time;
                hourDom.html(_hour);
                minuteDom.html(_minute);
                secondDom.html(_second);
            }, 1000);
            flag = false;
        } else {
            clearInterval(clearTime);
            $(this).attr('disabled', 'disabled');
        }
    })
    //选择特效处理
    let subject = $('.subject-main');
    let $item, $option, $optionLabel, $label, tagName;
    subject.click(function(e) {
        //获取档当前元素
        $item = $(e.target);
        //获取相邻元素
        //获取元素名(判断点击的元素是否为选择)
        tagName = e.target.tagName;
        if (tagName === 'A') {
            // 点击a链接出发事件
            //设置点击效果
            //找到label标签
            $label = $item.find('label');
            //找到其他的label标签
            $option = $(e.target).siblings('.subject-options');
            //设置点击后效果
            $label.addClass('checked');
            //其他的还原效果
            $option.each(function(index, ele) {
                $optionLabel = $(ele).find('label');
                $optionLabel.removeClass('checked')
            });
        }
        if (tagName === 'SPAN' && e.target.className === 'icons') {
            //点击图标出发事件
            //设置点击效果
            //找到label标签
            $label = $item.parent();
            //找到其他的label标签
            $option = $label.parent('.subject-options').siblings('.subject-options');
            //设置点击后效果
            $label.addClass('checked');
            //其他的还原效果
            $option.each(function(index, ele) {
                $optionLabel = $(ele).find('label');
                $optionLabel.removeClass('checked')
            });
        }
    })
    //下一题
    let $checked, checkedOPtions, itemI;
    let selectdeBtn = $('#selectdeBtn');
    selectdeBtn.click(function(e) {
        $checked = $('.exam-wrap-judge').find('.checked').parent();
        $checked.each(function(index, ele) {
            $checkedOPtions = $(ele);
            itemI = $checkedOPtions.attr('data-id');
            obj.judgeData.push(itemI)
        })
        //设置分数
        $('#score-select').html('10分')
        //进入下一题型
        $('.exam-wrap-judge').hide();
        $('.exam-wrap-select').show();
        scrollTo(0, 0);
    })
    //提交
    let aheadFinish = $('#aheadFinish');
    aheadFinish.click(function(e) {
        $checked = $('.exam-wrap-select').find('.checked').parent();
        $checked.each(function(index, ele) {
            $checkedOPtions = $(ele);
            itemI = $checkedOPtions.attr('data-id');
            obj.selectData.push(itemI)
        })
        //设置选择题的分数
        $('#score-judge').html('40分')
        //设置总分
        $('#score-total').html('50分')
        console.log(obj)
    })
}, 'json')

//格式化数字
function formatNumber(num) {
    let _num = num;
    _num = _num > 9 ? _num : '0' + _num;
    return _num;
}