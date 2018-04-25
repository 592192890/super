/**
 * @file biling-records.js
 * @synopsis  模块名称
 * @author liuhui
 * @version 1.0.0
 * @date 2017-10-18
 * modify by  zgc
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
    var context = require('lib/gallery/context/1.0.0/context');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('lib/core/1.0.0/io/request');
    var Tab = require('common/tab/2.0.0/tab');
    var loadUrl = context.getConf('url.listUrl');
    var opt = {
        tabsLink: $(".jWrap .hd-item"),
        init:function(){
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            var tb = new Tab('.jWrap', {
                loaded: function() {}
            });
            console.log(self.tabsLink)
            self.tabClick(self.tabsLink);
            //默认触发第一个
            $('.jElectronic').trigger("click");
        },
        emptyStr:function() {
            var ar = [];
            ar.push('<div class="mod-list-empty">',
                '<img src="http://s1.bbgstatic.com/super/images/conf/electronic-list/1.0.0/elecEmpty.png"/>', '<p class="row-1">亲，您还没有开票信息哦~</p>', 
                '<p class="row-2">您可以在这里管理、查看您所有开票申请以及开票处理的进度（包括电子发票下载和纸质邮寄进度）</p></div>');
            return ar.join('');
        },
        tabClick:function(tabsLink){
            var self = this;
            tabsLink.on('click',function(){
                var invoiceType = $(this).attr('data-type');//invoiceType 1电子2纸质
                //console.log(invoiceType)
                $('.jInvoiceWrap').html("");//清空
                var lazyMore = new Lazystream($('.jInvoiceWrap'), {      
                    plUrl: loadUrl,
                    /* 参数传递 */
                    paramFormater: function(n)
                    {
                        var data = {};
                        data.pageNo = n;
                        data.invoiceType = invoiceType;
                        //pageSize每页数量
                        return data;
                    },
                    page: 1,
                    container: $('.jInvoiceWrap'),
                    errorText: '<div class="loading">网络错误，点击重试</div>',
                    loadingClass: 'loading',
                    loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                    load: function(el) {
                        if ($('.jInvoiceWrap').children().children().length == 0) {
                            $('.jInvoiceWrap').html(self.emptyStr());
                            return false;
                        }
                    },
                    noAnyMore: '<div class="loading-txt">已加载完全部小票</div>'
                }); 
            })
        },

    };
    opt.init();
});