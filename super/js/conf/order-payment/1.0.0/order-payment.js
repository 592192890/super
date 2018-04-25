/**
 * @file order-payment.js
 * @synopsis  order-payment
 * @author zhouwei, 1097009033@qq.com
 * @version 1.0.0
 * @date 2017-03-13
 * modify by
 */
define(function(require, exports, module) {
    'use strict';

	require(['common/ui/countdown/countdown'],function (countDown) {
            var time_pay = $(".jTimePay");
            countDown({
                currentTime: time_pay.attr('data-starttime'),
                targetTime: time_pay.attr('data-endTime'),
                timeText: ['', '小时', '分', '秒', ''],
                container: time_pay,
                isShowTimeText: true,
                isShowArea: true,
                type: {
                    'd': false,
                    'h': true,
                    'm': true,
                    's': true,
                    'ms': false
                },
                callback: function (dom) {
                    //倒计时为0后回调
                    
                }
            });
    });
});