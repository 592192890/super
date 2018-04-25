/* 
 * @Author: zgc
 * @Date:   2017-05-25 15:08:02
 * @Last Modified by: zgc
 * @Last Modified time: 2018-03-30 16:28:28
*/

define(function(require, exports, module) {
    'use strict'; 
    var $ = require('jquery'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        context = require('lib/gallery/context/1.0.0/context'),
        toTop = require('common/ui/nav/back2top'),
        timeRecently = 0,
        noMoreTxt = '<div class="loading-txt">近30天没有更多数据了<a href="javascript:void(0)" class="gray jMoreData">点击查看更多</a></div>',
        opt;
    opt = {
        init : function(){
           this.lazyStream();
           this.loadOldData();
        },
        lazyStream : function(){
            new LazyStream('.jLazy',{
                plUrl: context.getConf('url.Url') + '?isAjax=1',
                //参数传递 
                paramFormater: function(n)
                {
                    var data = {};
                    data.pageNo = n;
                    data.time = timeRecently;
                    return data;
                },
                page: 2,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: '',
                loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function(el) {
                    
                },
                noAnyMore: noMoreTxt
            });
        },
        loadOldData: function() {
            var self = this;
            $('body').on('click','.jMoreData',function(){
                timeRecently = 1;
                noMoreTxt = '<div class="loading-txt">已加载完全部数据</div>';
                if($(this).text()=='查看更多'){
                    $('.jLazy').html('');
                }else{
                    $(this).parent('.loading-txt').remove();
                }
                self.lazyStream();
            })
        }
    }
     opt.init();//初始化
})