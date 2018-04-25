/**
 * @file my-center.js
 * @synopsis  个人中心
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-03-28
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box');

    //二维码扫描 start
    var qr = $(".mod-money .qr-code")
    var url = qr.attr("data-url");
    io.jsonp(url, {type:'pay'}, function(json){
        if (json.data.pay_url) {
            var hrefData = json.data.pay_url;
            qr.attr('href', hrefData);
        }else{
            qr.click(function() {
                box.tips('没有获取到当前用户数据');
                qr.attr('href', 'javascript:;');
            });  
        };       
    },function(json){
        qr.click(function() {
                box.tips('出错啦！刷新页面再试试？！');
                qr.attr('href', 'javascript:;');
        });
    });
    //二维码扫描 end
    //订单数量显示隐藏
    var b = $(".mod-body .order-entrance b");
    b.each(function() {
        var num = $(this).text();
        if (!num || num == 0) {
            $(this).hide();
        }else{
            $(this).show();
        }
    });
    var msg = $("header .inf b");
        var num = msg.text();
        if (num > "3") {
            msg.text("···");
        };
        if (!num || num == 0) {
            msg.hide();
        }else{
            msg.show();
        };            

});

