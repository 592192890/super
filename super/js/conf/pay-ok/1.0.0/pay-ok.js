/**
 * @file pay-ok.js
 * @synopsis  模块名称
 * @author liuhui, 1026527082@qq.com
 * @version 1.0.0
 * @date 2017-03-8
 * modify by  XX
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var context = require('lib/gallery/context/1.0.0/context');
    var payStatus = context.getConf('payStatus');
    var box = require('common/box/1.0.0/box');
    var payokUrl = context.getConf('url.payokUrl');
    var orderIds = context.getConf('orderIds');

    //支付中
        $('#jLoading').click(function(){
            var b = box.loading('支付中');
            //b.hide(); 可以隐藏loading
            setTimeout(function()
            {
                b.hide();
            }, 5000);
        });
        $('#jLoading').trigger("click");

    if (payStatus == 2) {
        setTimeout(function(){
        	io.post(payokUrl+orderIds+'?isAjax=1', {}, function(res) {
    			var payStatus = res.data.payStatus;
    			if (payStatus!==2) {
    				window.location.reload();
    			}
    		});
        },"2000");
    }

});