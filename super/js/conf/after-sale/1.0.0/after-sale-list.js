/**
 * @file presale.js
 * @synopsis  售后列表
 * @author scott, 592192890@qq.com
 * @version 1.0.0
 * @date 2017-03-15
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        context=require('lib/gallery/context/1.0.0/context'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        Box = require('common/box/1.0.0/box'),
	    Lazystream = require('common/lazystream/1.0.0/js/lazystream');
       

    // main method:start point of pragram
    init();
    //图片懒加载	 
	function lazyload(){
		return new Lazyload('.jLazy', {
			effect: 'fadeIn', // 加载效果
			dataAttribute: 'src', //data属性默认src 
			skipInvisible: false,  // 是否跳过隐藏图片
			loadingClass: 'img-loading', //设置懒加载图片classname
			placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' // 设置加载前占位图片
		});
	};
    function emptyStr() {
        var ar = [];
        ar.push('<div class="ui-page-tips jEmptyStr">',
            '<i class="tips-img"><img src="//ssl.bbgstatic.com/super/images/conf/after-sale/1.0.0/none-list.png"/></i>', '<p class="tips-txt">您还没有售后信息哦</p>', '</div>');
        return ar.join('');
    }
    function init(){
        var apiUrl=context.getConf('url.afterSaleList');
        var cancelApplyUrl=context.getConf('url.cancelApply');
        lazyload();
        new Lazystream('.jPage',{
            plUrl: apiUrl+"?isAjax=1",
            /* 参数传递 */
            paramFormater: function(n)
            {
                var data = {
                };
                data.pageNo = n;
                return data;
            },
            page: 1,
            errorText: '<div class="loading">网络错误，点击重试</div>',
            loadingClass: '',
            loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                if ($('.jPage').find('.item').length == 0) {
                    $('.jPage').html(emptyStr());
                    return false;
                }
                lazyload();
            },
            noAnyMore: '<div class="list-loaded">已经加载完全部信息哟</div>'
        });
        //取消申请操作
        $('.jPage').on('click','.jCancelApply',function(e){
            Box.confirmBox(
                '取消申请',
                {
                    okValue: '确定', //确定文字修改
                    cancelValue: '取消' //取消文字修改
                }
            ).action({
                ok: function(){
                    var dataId=e.target.dataset.id;
                    io.post({
                        url:cancelApplyUrl,
                        data:{
                            reverseId:dataId
                        },
                        success:function(result){
                            window.location.reload();
                        },
                        error:function(err){
                            Box.error(err.msg);
                        }
                    });
                },
                cancel: function(){
                    
                }
            });
            
        });
    }
   
});
