/**
 * @file electronic-list.js
 * @synopsis  模块名称
 * @author liuhui, 1026527082@qq.com
 * @version 1.0.0
 * @date 2018-01-09
 * modify by  zgc
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
    var context = require('lib/gallery/context/1.0.0/context');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('lib/core/1.0.0/io/request');
    var wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2');
    var loadUrl = context.getConf('url.listUrl');
    //tab切换
    var Tab = require('common/tab/2.0.0/tab');
    var timeRecently = 0;
    var noMoreTxt = '<div class="loading-txt">近30天没有更多数据了<a href="javascript:void(0)" class="gray jMoreData">点击查看更多</a></div>';
    var electricTicket;

    electricTicket = {
        init: function () {
            this.bindEvent();
            // this.tickets();
            this.initBack();
            this.loadOldData();
        },
        bindEvent: function () {
            var self = this;
            var tb = new Tab('.jWrap', {
                loaded: function (obj) {
                    self.tickets(obj.$ctn);
                }
            });
            tb.on('tabClick', function (obj) {
                timeRecently = 0;
                noMoreTxt = '<div class="loading-txt">近30天没有更多数据了<a href="javascript:void(0)" class="gray jMoreData">点击查看更多</a></div>';
                self.tickets(obj.$ctn);
            });
        },
        emptyStr: function (type) {
            var ar = [];
            var tips = {0:['近30天暂无数据','<a href="javascript:void(0)" class="gray jMoreData">查看更多</a>'],1:['暂无历史数据','']};
            ar.push('<div class="ui-page-tips jEmptyStr">',
                '<i class="tips-img"><img src="https://img4.bbgstatic.com/15b22cfccb3_bc_8ef75d7040bab77688ecb2168931c0fc_308x266.png"/></i>', 
                '<p class="tips-txt">'+tips[timeRecently][0]+'</p>', 
                tips[timeRecently][1],
                '</div>');
            return ar.join('');
        },
        tickets: function ($el) {
            var self = this;
            var type = $($el).attr('data-type');
            if(timeRecently == 0){
                if ($($el).find('[data-page]').length != 0 || $($el).find('.jEmptyStr').length != 0) {
                    return false;
                }
            }
            
            var lazyMore = new Lazystream($el, {
                plUrl: loadUrl,
                /* 参数传递 */
                paramFormater: function (n) {
                    var data = {};
                    data.pageNo = n;
                    data.type = type;
                    data.time = timeRecently;
                    return data;
                },
                page: 1,
                // container: $el,
                isSkipAboveTop: false,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: '',
                loadingText: '<div class="loading"><img src="http://ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function (el) {
                    if (!el || $(el).children().length == 0 && $el.find('.mod-item').length == 0) {
                        $el.html(self.emptyStr(type));
                        return false;
                    }
                },
                noAnyMore: noMoreTxt
            });
        },
        loadOldData: function() {
            var self = this;
            $('body').on('click','.jMoreData',function(){
                timeRecently = 1;
                noMoreTxt = '<div class="loading-txt">已加载完全部数据</div>';
                var _this = this;
                $('.hd-item').each(function(){
                    if($(this).hasClass('active')){
                        var index = parseInt( $(this).attr('data-type') );
                        if($(_this).text()=='查看更多'){
                            $('.bd-item').eq(index-1).html('');
                        }else{
                            $(_this).parent('.loading-txt').remove();
                        }
                        self.tickets($('.bd-item').eq(index-1));
                    }
                })
            })
        },
        initBack: function () {
            var self = this; 
            self.param.isRun = false;  
            setTimeout(function () { self.param.isRun = true; }, 1000); //延迟1秒 防止微信返回立即执行popstate事件  
            self.goBack();
        },
        param: {  
            isRun: false, //防止微信返回立即执行popstate事件  
        },
        goBack:function(){
            var self = this;
            var state = {  
                title: "title",  
                url: "#"  
            };  
            window.history.pushState(state, "title", "#"); 
            window.addEventListener("popstate", function(e) {
                wx.miniProgram.getEnv(function(res) {
                    if(res.miniprogram){
                        wx.miniProgram.navigateBack({ delta: 1 })
                    }
                })
                if (self.param.isRun) { 
                    window.location.replace('https://wx.yunhou.com/super/member');
                }
            },false);
        },
        // initBack: function () {
        //     var self = this; 
        //     window.addEventListener('pageshow', function (self) {  
        //         alert(6)
        //         self.param.isRun = false;  
        //         setTimeout(function () { self.param.isRun = true; }, 100); //延迟1秒 防止微信返回立即执行popstate事件  
        //         self.goBack();  
        //     });  
        // }
    }
    electricTicket.init(); //初始化
});