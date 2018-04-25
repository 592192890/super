/**
 * @file park-coupon.js
 * @synopsis  模块名称
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-09-16
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        //box = require('common/box/2.0.0/js/box'),
        //template = require('common/template/1.0.1/template'), 

        opt;

    opt = {
        init: function () {
            this.bindEvent();
            this.showRlus(); //券使用规则
        },
        bindEvent: function () {
            var self = this;
            var url = decodeURI(location.href),
                shopId = self.getUrlParam(url, 'shopId'),
                carNo = self.getUrlParam(url, 'carNo'); //console.log(carNo)
            $('.jCouponItem').click(function () {
                var couponIds = $(this).attr('data-value');
                // console.log(couponIds)
                window.location.replace (context.getConf('url.pay') + '&shopId=' + shopId + '&carNo=' + carNo + '&couponIds=' + couponIds);
            })
            //不用优惠券
            $('.disuse-coupon button').click(function () {
                window.location.replace (context.getConf('url.pay') + '&shopId=' + shopId + '&carNo=' + carNo);
            })
        },
        showRlus: function () {
            //下拉展示
            $('body').on('click', '.jShowCouponInfo ', function () {
                var $arrow = $(this).find('.jCouponArrow');
                var $ctn = $(this).closest('.jItemBox').find('.jItemCtn');
                var $section = $(this).closest('.jCouponList');
                var $allCtn = $section.find('.jItemCtn');
                var isVisible = $ctn.is(':visible');
                var $allArrow = $section.find('.jShowCouponInfo').find('.jCouponArrow');
                $allCtn.hide();
                $allArrow.show();
                $arrow[isVisible ? 'show' : 'hide']();
                $ctn[isVisible ? 'hide' : 'show']();
            })
        },
        getUrlParam: function (url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.split('?')[1].substr(0).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

    }
    opt.init(); //初始化
});