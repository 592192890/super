/**
* @file my-integral.js
* @synopsis  my-integral
* @author yanghiatao, 178224406@qq.com
* @version 1.0.0
* @date 2017-12-08
 */

define(function(require, exports, module) {
    'use strict';

    var context = require('lib/gallery/context/1.0.0/context');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var lay;
    
    lay = new LazyStream('.detail-list', {
        plUrl: context.getConf('url.pageUrl'),
        /* 参数传递 */
        paramFormater: function(n) {
            var data = {};
            data.currentPage = n;
            data.pageSize = 2;
            return data;
        },
        page: 1,
        isSkipAboveTop: true,
        errorText: '<li class="loading"> 网络错误， 点击重试 </li>',
        loadingClass: '',
        loadingText: '<li class="loading">正在加载，请稍后...</li>',
        load: function(el) {
            
        },
        noAnyMore: '<li class="loading">已经加载完全</li>'
    });

});
