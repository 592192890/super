/**
 * @file activity.js
 * @synopsis  模块名称
 * @author liuhui, 1026527082@qq.com
 * @version 1.0.0
 * @date 2017-02-23
 * modify by  XX
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
    var context = require('lib/gallery/context/1.0.0/context');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var Tab = require('common/tab/1.0.0/tab');
    var io = require('lib/core/1.0.0/io/request');
    var messageUrl = context.getConf('url.messageUrl');
    var dataValue=1;
    //tab切换
    var tb = new Tab('.jWrap');
    // 图片懒加载
    var lazy = new Lazyload('.ui-lazy', {
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
   
    var mymessage = {
        dataValue:'1',
        init:function(){
            var self = this;
            $('.jWrap a').on('click',function() {

            self.dataValue = $(this).attr('data-value');
            $('.jWrap a .item-line').addClass('active');
            $('#Dot'+self.dataValue).hide();
            //将data-value传递给后台
            io.jsonp(messageUrl+'&groupId='+self.dataValue, {}, 
            function(res) {
                var jDom = res.data.html;
                $(".jWrap").siblings().empty();
                $('.jPage').append(jDom);
                 // 图片懒加载
                var lazy = new Lazyload('.ui-lazy', {
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
                 var lazyMore = new Lazystream('.jPage', {      
                    plUrl: messageUrl,
                    /* 参数传递 */
                    paramFormater: function(n)
                    {
                        var data = {};
                        data.pageNo = n;
                        data.groupId = self.dataValue;
                        return data;
                    },
                    page: 2,
                    errorText: '<div class="loading">网络错误，点击重试</div>',
                    loadingClass: 'loading',
                    loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/public/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                    load: function(el) {
                        // 图片懒加载
                        var lazy = new Lazyload('.ui-lazy', {
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
                    }
                }); 
            });       
        });
        $('.jWrap a:first').trigger("click");
        self.lazyData();
        },
        lazyData:function(){
            var self = this;
             // 数据懒加载
            var lazyMore = new Lazystream('.jPage', {      
                plUrl: messageUrl,
                /* 参数传递 */
                paramFormater: function(n)
                {
                    var data = {};
                    data.pageNo = n;
                    data.groupId = self.dataValue;
                    return data;
                },
                page: 2,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: 'loading',
                loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/public/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function(el) {
                    // 图片懒加载
                    var lazy = new Lazyload('.ui-lazy', {
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
                }
            }); 
        },
    }
    mymessage.init();

	//跳转点击事件
	$('.jSkip').on('click',function(){
		var dataPass = $(this).attr('data-pass');
		io.jsonp('//wx.yunhou.com/super/member/mymessage', 
			{dataPass: dataPass}, 
			function(res) {});
	});

    
});

