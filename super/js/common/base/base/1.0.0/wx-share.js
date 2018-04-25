/**
 * @file wx-share.js
 * @synopsis  微信分享
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-06-12
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var box = require('common/box/1.0.0/box');
    var io = require('lib/core/1.0.0/io/request');
    var wx = require('../../jweixin-1.0.0');
    var defaultOption = {
        url: '//wx.yunhou.com/super/api/getWeixinConfig', //获取微信参数配置
        shareLink: window.location.href, //分享的链接 
        sharedTitle: '',
        shareSummary: '',
        sharedImageURL: '//ssl.bbgstatic.com/gshop/images/topic/penny-share/index-flag.jpg' //微信分享的图片
    };
    var wxShare = {
        init: function(opt) {
            var self = this;
            self.opt = {};
            $.extend(self.opt, defaultOption, opt, true);
            if (self.isWeixin()) {
                self.getWeixinConfig();
                self.wx.ready(function() {
                    self.afterWeixinShare(function() {}, function() {})
                });
            }
        },
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'scanQRCode'],
        getWeixinConfig: function() {
            var self = this;
            self.ajax(self.opt.url, {
                url: window.location.href
            }, function(data) {
                var rs = data.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: rs.appId, // 必填，公众号的唯一标识
                    timestamp: rs.timestamp, // 必填，生成签名的时间戳
                    nonceStr: rs.nonceStr, // 必填，生成签名的随机串
                    signature: rs.signature, // 必填，签名，见附录1
                    jsApiList: self.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            });
        },
        afterWeixinShare: function(successFun, cancelFun) {
            var self = this;
            var shareAr = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'];
            var opt = {
                title: self.opt.sharedTitle, //分享的标题 
                desc: self.opt.shareSummary, //分享描述
                link: self.opt.shareLink, // 分享链接
                imgUrl: self.opt.sharedImageURL, // 分享图标
                success: function() {
                    successFun && successFun();
                },
                cancel: function() {
                    cancelFun && cancelFun();
                }
            }
            for (var i = 0; i < shareAr.length; i++) {
                eval('self.wx.' + shareAr[i] + '(opt)');
            }
        },
        wx: wx,
        //判断微信内置浏览器
        isWeixin: function() {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.match(/MicroMessenger/i) == "micromessenger");
        },
        ajax: function(url, data, successFun, errorFun, obj) {
            io.jsonp(url, data, function(data) {
                if (data.msg && data.msg.length != 0) {
                    box.tips('<div class="dialog-tips">' + data.msg + '</div>', {
                        id: 'dialog-tips'
                    });
                    successFun && successFun(data);
                } else {
                    if (data.data != null && data.data != undefined) {
                        successFun && successFun(data);
                    }
                }
            }, function(data) {
                if (data.msg && data.msg.length != 0) {
                    box.tips('<div class="dialog-tips">' + data.msg + '</div>', {
                        id: 'dialog-tips'
                    });
                }
                errorFun && errorFun(data);
            }, obj);
        }
    };
    module.exports = wxShare;
});
