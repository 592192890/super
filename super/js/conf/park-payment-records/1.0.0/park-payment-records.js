/**
 * @file park-payment-records.js
 * @synopsis  我的缴费记录
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
    var context = require('lib/gallery/context/1.0.0/context');
    // var wx = require('common/base/jweixin-1.3.0');
    var listUrl = context.getConf('url.list');
    //  回到顶部
    require('common/ui/nav/back2top')();
    var hasHistory = parseInt( context.getConf('hasHistory') );//没车牌0，有车牌1
    if(hasHistory){
        var lazyMore = new Lazystream('.jPage', {
            plUrl: listUrl,
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
            loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                
            },
            noAnyMore: '<div class="loading">已经加载完全部缴费记录</div>'
        });
    }
    function getReferrer() {
        var referrer = '';
        try {
            referrer = window.top.document.referrer;
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer;
                } catch (e2) {
                    referrer = '';
                }
            }
        }
        if (referrer === '') {
            referrer = document.referrer;
        }
        return referrer;
    };
    window.history.pushState(null, null, null);
    var backUrl = getReferrer();
    var bool = false;
    setTimeout(function () {
        bool = true;
    }, 1000);
    window.addEventListener("popstate", function (e) {
        if (bool) {
            window.location.href = backUrl;
        }
    }, false);
});
