/**
 * @description 活动列表
 * @author leay
 * @date 2016-10-21 
 * @version 1.0.0
 * @alter liuwei 2017-03-14
 * @alter yanghaitao 2017-06-13
 */
define(function(require, exports, module) {
    'use strict';
    
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
	var box = require('common/box/1.0.0/box');
    var details = require('module/active/mod-details/1.0.0/act-details');
    var coupon = require('module/active/mod-details/1.0.0/act-coupon');
    var signStatus = require('module/active/mod-details/1.0.0/sign-status');
	var actTime = require('module/active/mod-details/1.0.0/act-time');

    //  滚图
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var params = {}
	
	//首页的轮播图大于一张使用轮播插件
    if($('.jSliderImg').length>1){
        var slider = new Slider('#slides', {
            width:640,
            height:222,
            lazyLoad: {
                attr: 'data-url',
                loadingClass: 'img-error'
            },
            play: {
              auto: true,
              interval: 4000,
              swap: true,
              pauseOnHover: true,
              restartDelay: 2500
            },
            callback:{
                start:function(index){
                },
                loaded : function(){
                }
            }
        });
    }else{
        var el = $('.jSliderImg').eq(0);
        var src = el.attr('data-url');
        sliderImgLoad(src,el);
        $('#slides').addClass('ui-slider-one');
    }
	
	//判断图片下载完成，完成则显示真是图片
    function sliderImgLoad(src,el) {
        if (isImgUrl(src)) {
            var objImg = new Image();
            objImg.src = src;
            if (objImg.complete) {
                el.attr('src',src).removeClass('img-error').removeAttr('data-url');
            } else {
                objImg.onload = function() {
                    el.attr('src',src).removeClass('img-error').removeAttr('data-url');
                };
            }
        }
    }
	
	//匹配合法地址
    function isImgUrl(str) {
        return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
    }
	
	//切换活动优惠券的规则的显隐
    $('.jRule').click(function(){
        var $rule = $(this).find('.rule-bd');
        var $animate = $(this).find('.animate');
        if(!$animate.hasClass('shown') && $rule.is(':hidden')){
            $(this).find('.animate').addClass('shown');
            $rule.show();
        }else{
            $(this).find('.animate').removeClass('shown');
            $rule.hide();
        }
    });

	//优惠券列表的显隐
    $('.jMoreCp').click(function(){
        var $cp = $('.other-cp');
        if($cp.is(':hidden')){
            $cp.show();
            $(this).html('点击收缩');
        }else{
            $cp.hide();
            $(this).html('点击展开');
        }
    });
	//售后电话
	$('#jphone').click(function(){
		var phone=$(this).attr('data-tel');
		if(!phone){
			box.alert('系统错误');
		}
		box.confirmBox(
		'确定拨打电话：<a id="jplayphone" href="tel:'+phone+'">'+phone+'</a> 吗？',
		{
				title: '提示',
				okValue: '拨打',
				cancelValue: '取消'
		}).action({
			ok: function(){
				$("#jplayphone").trigger("click");
			}
		});
	});

});
