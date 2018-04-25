/**
 * @file group-buying.js
 * @synopsis  团购聚合
 * @author zhouguangcheng, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-03-29
 * @update H5 to APP function
 * @author leaytam
 * @Date 2017-05-10
 */

define(function(require, exports, module) {
    'use strict';   
    var $ = require('jquery'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        context = require('lib/gallery/context/1.0.0/context'),
        toTop = require('common/ui/nav/back2top'),      
        CountDown = require('lib/gallery/countdown/1.0.0/countdown'),
        Browser = require('module/browser/1.0.0/browser'),
        MobileApi = require('mobileapi');
        //第一页倒计时 start
        //循环遍历每一个倒计时节点，添加倒计时逻辑
        $(".jStartTime").each(function() {
            var countDown = new CountDown({
                targetTime:$(this).prev('a').attr('s-time'),
                timeText : ['','','',''],
                container : $(this),
                isShowTimeText : true,
                isShowArea : true,
                type : {
                    'd' : false,
                    'h' : false,
                    'm' : false,
                    's' : false,
                    'ms' : false
                },
                //倒计时结束后
                callback : function(e) {
                    e.prev('a').addClass('ui-button-red').removeClass('ui-button-red-border');
                    e.prev('a').text('去参团'); 
                }
            });
        });
        $(".jStartTime").each(function() {
            var countDown = new CountDown({
                targetTime:$(this).prev('a').attr('e-time'),
                timeText : ['','','',''],
                container : $(this),
                isShowTimeText : true,
                isShowArea : true,
                type : {
                    'd' : false,
                    'h' : false,
                    'm' : false,
                    's' : false,
                    'ms' : false
                },
                //倒计时结束后
                callback : function(e) {
                    e.prev('a').addClass('ui-button-white').removeClass('ui-button-red');
                    e.prev('a').text('团购结束'); 
                }
            });
        });
        //倒计时 end

        //app中设置页面标题
        if(Browser.isInsideAPP() && Browser.isIos()){
            MobileApi.call('system.setTitle', document.title);
        }

        $('.page-view').on('click', '.jProduct', function(){
            var productId = $(this).attr('data-productid');
            if(Browser.isInsideAPP()){
                MobileApi.call('goods.productIndex', productId);
            }else{
                window.location.href = context.getConf('url.productUrl') + productId + '.html';
            }
        });
        //
        /* 图片懒加载 */
    var lazyImg = new Lazyload('.ui-lazy', {
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

        /* 数据懒加载 */
    var lazyStream = new LazyStream('.jLazy',{
        plUrl: context.getConf('url.pageUrl') + '?isAjax=1',
        //参数传递 
        paramFormater: function(n)
        {
            var data = {};
            data.pageNo = n;
            return data;
        },
        page: 2,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="//ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            /* 图片懒加载 */
            var lazyImg = new Lazyload('.ui-lazy', {
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

            //倒计时 start
            //循环遍历每一个倒计时节点，添加倒计时逻辑
            $(".jStartTime").each(function() {
            var countDown = new CountDown({
                targetTime:$(this).prev('a').attr('s-time'),
                timeText : ['','','',''],
                container : $(this),
                isShowTimeText : true,
                isShowArea : true,
                type : {
                    'd' : false,
                    'h' : false,
                    'm' : false,
                    's' : false,
                    'ms' : false
                },
                //倒计时结束后
                callback : function(e) {
                    e.prev('a').addClass('ui-button-red').removeClass('ui-button-red-border');
                    e.prev('a').text('去参团'); 
                }
            });
        });
        $(".jStartTime").each(function() {
            var countDown = new CountDown({
                targetTime:$(this).prev('a').attr('e-time'),
                timeText : ['','','',''],
                container : $(this),
                isShowTimeText : true,
                isShowArea : true,
                type : {
                    'd' : false,
                    'h' : false,
                    'm' : false,
                    's' : false,
                    'ms' : false
                },
                //倒计时结束后
                callback : function(e) {
                    e.prev('a').addClass('ui-button-white').removeClass('ui-button-red');
                    e.prev('a').text('团购结束'); 
                }
            });
        });
            //倒计时 end
        },
        noAnyMore: '<div class="loading">已经加载完全部活动哟</div>'
    });

        /* 回到顶部 */
    var toTop = new toTop();
    
})
