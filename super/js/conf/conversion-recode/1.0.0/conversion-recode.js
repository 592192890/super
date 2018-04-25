/**
 * @file conversion-recode.js
 * @synopsis  积分兑换记录
 * @author zhouwei, 1097009033@qq.com
 * @version 1.0.0
 * @date 2017-06-23
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
    var context = require('lib/gallery/context/1.0.0/context');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

    //  回到顶部
    require('common/ui/nav/back2top')();

    var LazyUrl = context.getConf('url.LazyUrl');
    //  赖加载更多记录
    var lazyMore = new Lazystream('.jPage', {
        plUrl: LazyUrl,
        /* 参数传递 */
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
        noAnyMore: '<div class="loading tips-center">没有更多兑换记录了</div>'
    });
});
