/**
 * @file invitation-list.js
 * @synopsis  邀请人列表
 * @author zgc, zgc7788@gmail.com
 * @version 1.0.0
 * @date 2017-08-11
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/2.0.0/js/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        toTop = require('common/ui/nav/back2top'), 
        opt;

    opt = {
        init:function(){
           this.bindEvent();
        },
        bindEvent:function(){
            //数据懒加载
           var lazyStream = new LazyStream('.mod-inviter-list',{
                plUrl: context.getConf('url.pageList') + '?isAjax=1',
                //参数传递 
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
                noAnyMore: '<div class="loading">亲，已经看到最后啦！</div>'
            });

            new toTop();
        }
    }
    
    opt.init();//初始化
});