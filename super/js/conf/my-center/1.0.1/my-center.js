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

    //二维码扫描 
     var myCenter = {
        qr:$(".mod-money .qr-code"),
        wallet:$(".mod-money .wallet"),
        url:"",
        payUrl:"",
        walletUrl:"",
        qrTap:false,
        walletTap:false,
        init:function(){
            this.bindEvent();
        },
        bindEvent:function(){
            this.scan();
        },
        scan:function(){
            var self = this;

            self.url = self.qr.attr("data-url");
            self.qr.on('click',function() {
                self.qrTap = true; 
                self.getHerfUrl();
                // self.qr.trigger('click');
                if (self.payUrl) {
                    self.qrTap = false;
                    window.location.herf = self.payUrl;
                };
                
            });
            self.wallet.on('click',function() {
                self.walletTap = true;
                self.getHerfUrl();
                // self.wallet.trigger('click');
                if (self.walletUrl) {
                    self.walletTap = false;
                    window.location.herf = self.walletUrl;
                };
                // window.location.herf = self.walletUrl;
            });
            
        },
        firstQrInto:function(){
            var self = this;
            if (self.payUrl) {
                self.qrTap = false;
                window.location.href = self.payUrl;
            };
        },
        firstWalletInto:function(){
            var self = this;
            if (self.walletUrl) {
                self.walletTap = false;
                window.location.href = self.walletUrl;
            };
        },
        getHerfUrl:function(){
            var self = this;
            //如果链接地址值已经获取到，防止重复发送请求
            if(!self.payUrl && !self.walletUrl){
                io.jsonp(self.url, {type:'pay'}, function(json){
                    if (json.data.pay_url) {
                        self.payUrl = json.data.pay_url;
                        self.walletUrl = json.data.walet_url;
                        self.qr.attr('href', self.payUrl);
                        self.wallet.attr('href',self.walletUrl);
                        if (self.qrTap) {
                            self.firstQrInto();
                            self.qrTap = false;
                        };
                        if (self.walletTap) {
                            self.firstWalletInto();
                            self.walletTap = false;
                        };
                        

                    }else{
                        box.tips('没有获取到当前用户数据');
                        self.qr.attr('href', 'javascript:;'); 
                    };       
                    },function(json){
                        if (json.error == -100) {
                            box.tips(json.msg);
                        };
                        box.tips(json.msg);
                        // self.qr.on('click',function() {
                        //         box.tips('出错啦！刷新页面再试试？！');
                        //         self.qr.attr('href', 'javascript:;');
                        // });
                     });
                };
            
        },
    }
    myCenter.init();

    //订单数量标计
    var b = $(".mod-body .order-entrance b");
    b.each(function() {
        var num = $(this).text();
        if (!num || num == 0) {
            $(this).hide();
        }else{
            $(this).show();
        }
    });
    //通知数量标记
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
    //底部菜单跳转
    $("#jTab a").click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });         

});

