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

    //  回到顶部
    require('common/ui/nav/back2top')();
    var tap = true; 
    //  赖加载更多活动
    var lazyMore = new Lazystream('.jPage', {
        plUrl: '//wx.yunhou.com/super/activity/list?is_ajax=1',
        /* 参数传递 */
        paramFormater: function(n)
        {
            var data = {};
            data.pageNo = n;
            return data;
        },
        page: 1,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="//ssl.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            console.log($(this));
            var dom = [
                '<div class="page-view page-view-empty">',
                    '<div class="mod-item">',
                        '<div class="empty-img">',
                            '<img src="//ssl.bbgstatic.com/super/images/module/empty/network-error.png" alt=""/>',
                            '<div class="empty-description">当前没有进行的活动</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
            // $(this);
            // console.log($(el).children().length !== 0);
            if (tap && $(el).children().length == 0) {
                // console.log("ok");
                $(".jPage").html(dom);
                $('.page-view-empty').show();
            };
            tap = false;

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
        
        },
        noAnyMore: '<div class="loading jAllactivity">已经加载完全部活动哟</div>'
    });
    
});
