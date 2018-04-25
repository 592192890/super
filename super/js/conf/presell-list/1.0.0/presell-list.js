/**
 * @file order-active.js
 * @synopsis  模块名称
 * @author liuwei, 541042724@qq.com
 * @version 1.0.0
 * @date 2017-02-23
 * modify by  XX
 * update leaytam   H5 to APP function
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var CountDown = require('lib/gallery/countdown/1.0.0/countdown');
    var io = require('lib/core/1.0.0/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
	var Lazystream = require('common/lazystream/1.0.0/js/lazystream');
	var context = require('lib/gallery/context/1.0.0/context');
	var cookie = require('lib/core/1.0.0/io/cookie');
	var Browser = require('module/browser/1.0.0/browser');
	var MobileApi = require('mobileapi');
		
	//返回顶部
    require('common/ui/nav/back2top')();

    //设置APP中页面标题
    if(Browser.isInsideAPP() && Browser.isIos()){
		MobileApi.call('system.setTitle', document.title);
	}
	
	//图片懒加载	 
	var lazyload = function(){
		return new Lazyload('.jLazy', {
			effect: 'fadeIn', // 加载效果
			dataAttribute: 'src', //data属性默认src 
			skipInvisible: false,  // 是否跳过隐藏图片
			loadingClass: 'img-loading', //设置懒加载图片classname
			placeholder: context.getConf('url.placeholderUrl') // 设置加载前占位图片
		});
	};
	//记住列表所在位置 
	var loaction = {
		init : function(){
			var mark = this.readCookie();
			(mark.scrollTop && mark.bodyHeight)?this.srollToMark(mark):this.event();
		},
		readCookie : function(){
			var scrollTop = cookie.get('scrollTop');
			var bodyHeight = cookie.get('bodyHeight');
			return {
				'scrollTop' : scrollTop,
				'bodyHeight' : bodyHeight
			};
		},
		srollToMark : function(scrollTop){
			var mark = Number(scrollTop.scrollTop);
			var height = Number(scrollTop.bodyHeight);
			
			//$(".jPage").height(height);
			$(".jPage").css('min-height',height+'px');
			window.scrollTo(0,mark);
			this.event();
		},
		writeCookie : function(scrollTop,bodyHeight){
			cookie.set('scrollTop', scrollTop);
			cookie.set('bodyHeight', bodyHeight);
		},
		event : function(){
			var that = this;
			$(window).on('scroll.scroll2top',function(){
				 var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				 var bodyHeight = $(".jPage").height();
				 that.writeCookie(scrollTop,bodyHeight);
			});
			
			//兼容APP嵌套H5的时候，跳原生详情页
			$('.page-view').on('click', '.jProduct', function(){
				var productId = $(this).attr('data-productid');
				if(Browser.isInsideAPP()){
					MobileApi.call('goods.productIndex', productId);
				}else{
					window.location.href = context.getConf('url.productUrl') + productId + '.html';
				}
			});
		}
	};
	//按钮信息
	var	btnTxt = {
			before : {
				txt : '即将开始',
				btnClass : 'act-button-continue'
			},
			now : {
				txt : '立即抢',
				btnClass : '',
			},
			after : {
				txt : '已结束',
				btnClass : 'act-button-down'
			}
	};
	//绑定计时器方法
	var WorkFlow = {
		init : function(){
			this.ergodic();
		},
		ergodic : function(){
			//遍历初始化
			var that=this;
			 $(".jFlag").each(function() {
				that.rmClass($(this));
				that.juge($(this));
			});			
		},
		juge : function($dom){
			//判断活动状态
			if(!$dom){
				return;
			}
			var nowTime = parseInt($dom.attr('data-curtime'));
			var	startTime = parseInt($dom.attr('data-actStartTime'));
			var	endTime = parseInt($dom.attr('data-actEndTime'));
			var btn = this.getBtnItem($dom).children(".act-button-base");
			if(startTime > nowTime ){
				btn.addClass('jContinue');
				this.setTimer({
					time : startTime,
					$dom : $dom,
					func : this.startback
				});
			}else if(nowTime < endTime && startTime < nowTime){
				btn.addClass('jNow');
				this.setTimer({
					time : endTime,
					$dom : $dom,
					func : this.callback
				});
			}else{
				btn.addClass('jAfter');
			}
		},
		rmClass : function($dom){
			//移除被遍历类名
			$dom.hasClass("jFlag")?$dom.removeClass("jFlag"):{};
		},
		getBtnItem : function($dom){
			//获取当前模块按钮父节点
			return $dom.parent().siblings(".mod-content-ft");
		},
		setTimer : function(info){
			//配置倒计时
			var that=this;
			info.$dom.addClass("has-show");
			return  new CountDown({
				targetTime: info.time,
				timeText : [':','&nbsp;:&nbsp;','&nbsp;:&nbsp;',''],
				container : info.$dom,
				isShowTimeText : true,
				isShowArea : true,
				type : {
					'd' : false,
					'h' : true,
					'm' : true,
					's' : true,
					'ms' : false
				},
				callback : function() {
					info.func({
						$dom:info.$dom,
						that:that
					});
				}
			});			
		},
		startback : function(msg){
			//切换到活动开始
			var btn = msg.that.getBtnItem(msg.$dom).children(".act-button-base");
			var endTime = msg.$dom.attr('data-actEndTime');
			btn.html(btnTxt.now.txt);
			btn.addClass(btnTxt.now.btnClass);
			btn.hasClass("act-button-continue")?btn.removeClass("act-button-continue"):{};
			btn.removeClass('jContinue').addClass("jNow");
			msg.that.setTimer({
				time : endTime,
				$dom : msg.$dom,
				func : msg.that.callback
			});				
		},
		callback : function(msg){
			//切换到已抢完状态
			var btn = msg.that.getBtnItem(msg.$dom).children(".act-button-base");
			msg.$dom.hasClass("has-show")?msg.$dom.removeClass("has-show"):{};
			btn.html(btnTxt.after.txt);
			btn.addClass(btnTxt.after.btnClass);
			btn.removeClass('jNow').addClass("jAfter");
		}
	};
    //  懒加载数据
    var lazyMore = new Lazystream('.jPage', {
        plUrl: context.getConf('url.pageUrl') + '?isAjax=1',
        /* 参数传递 */
        paramFormater: function(n)
        {
            var data = {};
            data.pageNo = n;
            return data;
        },
        page: 2,
		isSkipAboveTop: true, 
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/pub/img/loading/loading32x32.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
			lazyload();
			WorkFlow.init(); //遍历新插入的dom
		},
        noAnyMore: '<div class="list-loaded">已经加载完全部活动哟</div>'
    });
	lazyload();
	WorkFlow.init();
	loaction.init();
	module.exports = {};
});