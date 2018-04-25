/**
 * @author	leaytam
 * @desc    basic component
 * @daet    2016-03-09
 * @alter	liuwei 2017-03-14
 */

define(function(require) {
    'use strict';

    var $ = require('jquery'),
	io = require('lib/core/1.0.0/io/request'),
	Box = require('lib/ui/box/1.0.1/box'),
	cookie = require('lib/core/1.0.0/io/cookie'),
	Circle = require('common/ui/circle/1.0.0/circle'),
	context = require('lib/gallery/context/1.0.0/context');

    //var url = {
    //    initCp: '//wx.yunhou.com/o2o/activity/couponstatus',
    //    getCp: '//wx.yunhou.com/o2o/activity/couponrecieve'
    //}

    // if (cookie("_nick")) {
    // if (getCouponId()) {
    //     io.jsonp(context.getConf('url.InitCp'), {
    //         couponids: getCouponId()
    //     }, function(rst) {
    //         var $cp = $('.jCpBox');
    //         if (rst && rst.data && rst.data.list) {
    //             var obj = rst.data.list;
    //             $cp.each(function(i, val) {
    //                 var key = $(this).attr('data-coupon-id');
    //                 if (obj[key]) {
    //                     //圆形数值
    //                     var $circle = $('.jCircle');
    //                     var $item = $circle.eq(i);
    //                     var dpr = Number($('html').attr('data-dpr'));
    //                     var value = 0;
    //                     if (obj[key]['percent']) {
    //                         value = Number(obj[key]['percent'].replace('%', ''));
    //                     }
    //                     $cp.find('.jCircle').attr('data-circle', value);
    //                     new Circle({
    //                         dom: $item[0], //容器
    //                         pbColor: '#f95d5b', //进度条颜色
    //                         pbWidth: 7 * (dpr / 2), //进度条宽度
    //                         value: value, //当前值
    //                         radius: 20 * dpr, //值为(radius-20)/2
    //                         openVal: 1.6, //圆缺口范围，2为满圆
    //                         fontSize: 24 * (dpr / 2),
    //                         rotate: 128
    //                     });
    //                     toggleCoupon($cp.eq(i), obj[key]);
    //                 }
    //             });
    //             /* for (var key in obj) { */

    //             // i++;
    //             /* } */
    //         }
    //         // for(var i=0, len=$cp.length; i<len; i++){
    //         // for(var j=0, jLen=rst.data.length; j<jLen; j++){
    //         // if($cp.eq(i).attr('data-coupon-id') == rst.data[j]['list'].id){
    //         // fillCoupon($cp.eq(i), rst.data[j]);
    //         // }
    //         // }
    //         // }
    //     });
    // };
    // }
    //获取优惠券id
    function getCouponId() {
            var ar = $('.jCpBtn').map(function() {
                return $(this).attr('data-coupon-id');
            }).get();
			(ar.length == 1)?$('.jCpBtn').addClass('cp-box-first'):{};
            if (ar.length == 0) {
                return false;
            } else {
                return ar.join(',');
            }
        }
        //切换优惠券

    function toggleCoupon($cp, data) {
        var flag = (data.status != 'recieved');
        $cp.find('.cp-end')[flag ? 'hide' : 'show']();
        $cp.find('.jCpBtn')[flag ? 'show' : 'hide']();
    }

    $('.jCpBtn').on('click', function() {
        var self = this,
            $this = $(this);
        var cpId = $(this).attr('data-coupon-id');
        var source = $(this).attr('data-coupon-source');
        var cpUrl = null;
        if(source == 'newplat_coupon'){
            cpUrl = '//wx.yunhou.com/super/coupon/receive_new'
        }else{
            cpUrl = context.getConf('url.GetCp')
        }
        var opt = {
            'coupon_id': cpId
        };
        io.jsonp(cpUrl, opt, function(rst) {
            Box.ok(rst.msg);
            toggleCoupon($this.closest('.jCpBox'), $.extend({
                status: 'recieved'
            }, rst));
        }, function(rst) {
            if (rst.error == -100) {
                Box.error('您还未登录，3秒后自动跳转登录页面').on('hidden', function() {
                    window.location.href = context.getConf('url.Login') + '?fromUrl=' + encodeURIComponent(window.location.href) + '&channel=120135&returnUrl=' + encodeURIComponent(window.location.href);
                });
                return false;
            }
            Box.error(rst.msg);
        }, self);
    });

});
