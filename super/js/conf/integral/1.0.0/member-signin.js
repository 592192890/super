/* 
* @Author: zgc
* @Date:   2017-05-27 09:52:32
* @Last Modified by:   zgc
<<<<<<< HEAD
* @Last Modified time: 2017-07-21 10:01:12
=======
* @Last Modified time: 2017-06-22 16:27:32
>>>>>>> zgc-integral-20170610
*/

define(function(require, exports, module) {
    'use strict'; 
    var $ = require('jquery'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        context = require('lib/gallery/context/1.0.0/context'),
        io = require('common/kit/io/request'),
        box = require('common/box/1.0.0/box'),
        // toTop = require('common/ui/nav/back2top'),
        nowadays = parseInt($('.jCheckins').attr('data-day')),
        checkinsList = $('.jCheckins li'),
        opt;

    opt = {
        init : function(){
           this.lazyImg(); 
           this.checkin();
           this.event();
        },
        lazyImg : function(){
            new Lazyload('.ui-lazy', {
                // 加载效果
                effect: 'fadeIn', 
                //data属性默认src <img data-src=""
                dataAttribute: 'src', 
                // 是否跳过隐藏图片
                skipInvisible: true,  
                //设置懒加载图片classname
                loadingClass: 'img-loading', 
                // 设置加载前占位图片
                placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' 
            });
        },
        checkin : function(){
            /* 天数列表 */
            if(nowadays>7) nowadays=7;
            checkinsList.each(function(index,element){
                if(index<nowadays) $(element).addClass('active').removeClass('today').html(index+1);
            })
            $(checkinsList[nowadays-1]).addClass('today').html('<i class="icon iconfontmod">&#xe614;</i>');
        },
        event : function(){
            var self = this;
            $('.jCheckinsBtn').click(function() {
                var _this = this;
                var $this = $(this),
                    checkinUrl = context.getConf('url.checkinUrl') + '?isAjax=1';
                    //nowadays++;
                    $this.attr('disabled','disabled');//防重复点击
                io.get(checkinUrl, {combo:nowadays+1}, function(data) {
                    box.tips(data.msg);
                    nowadays++;
                    /* 改变总积分 */
                    if(isNaN(data.data.point)||data.data.point === null){
                        box.tips('签到异常,请稍候重试');
                        return false;
                    }
                    $('.jTotal').text(parseInt($('.jTotal').text())+parseInt(data.data.point));
                    /* 签到按钮状态 */
                    $('.jCheckinsBtn').hide();
                    $('.jComboDays').show();
                    $('.jDays').text(nowadays);
                    self.checkin();
                    $this.removeAttr('disabled');
                },function(e){
                    box.tips(e.msg);
                    $this.removeAttr('disabled');
                },_this);
            });
        }
    }
    opt.init();//初始化
})