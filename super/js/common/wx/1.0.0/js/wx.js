/**
 * @file wx.js
 * @synopsis  weixin method
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @updated yanghaitao
 * @date 2017-12-25
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var io = require('lib/core/1.0.0/io/request');
    var wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2');
    var defaultSetting = {
        url: '//wx.yunhou.com/super/api/getWeixinConfig'
    };

    function Weixin(opt) {
        this.opt = {};
        $.extend(this.opt, defaultSetting, opt);
    }
    Weixin.prototype = {
        isWeixin: function() {
            var navigator = window.navigator;
            var userAgent = navigator.userAgent;
            userAgent = userAgent.toLowerCase();
            return userAgent.match(/micromessenger/i) == 'micromessenger';
        },
        getConfig: function(_opt, callback) {
            var self = this;
            io.jsonp(self.opt.url, {
                url: window.location.href
            }, function(res) {
                var opt = {
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.noncestr,
                    signature: res.data.signature
                };
                opt = $.extend(opt, _opt);
                wx.config(opt);
                wx.ready(function() {
                    callback && callback();
                });
            });
        },
        scanQRCode: function() {
            var self = this;
            self.getConfig({
                jsApiList: ['scanQRCode']
            }, function() {
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function(res) {
                        self.emit('scanQRCodeSuccess', res);
                    }
                });
            });
            return self;
        },

        chooseImage: function(opts) {
            var self = this;
            self.getConfig({
                jsApiList: ['chooseImage', 'uploadImage']
            }, function() {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function(res) {
                        wx.uploadImage({
                            localId: '' + res.localIds[0], // res.localIds 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            isShowProgressTips: 1,
                            success: function(res) {
                                self.emit('updateImageSuccess', res.serverId);
                            },
                            fail: function(error) {
                                self.emit('updateImageFail', JSON.stringify(error));
                            }
                        });
                    }
                });
            });
            return self;
        },

        share: function(data) {
            var data = data || {};
            var self = this;
            var shareAr = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];
            var source = ['WEIXIN', 'WEIXIN', 'QQ', 'SINA', 'QQ'];
            var jsApiList = [].concat(shareAr);
            self.getConfig({
                jsApiList: jsApiList
            }, function() {

                for (var i = 0; i < shareAr.length; i++) {
                    var opt = {
                        _source: source[i],
                        title: data.title || '步步高线上商城', //分享的标题
                        desc: data.desc || '亲爱的，步步高服务至上，正品低价，最贴心的服务送给你', //分享描述
                        link: data.link || window.location.href, // 分享链接
                        imgUrl: data.imgUrl || 'https://ssl.bbgstatic.com/super/images/common/bbg-logo.jpg', // 分享图标
                        success: function(res) {
                            var _self = this;
                            self.emit('shareSuccess', _self._source)
                        },
                        cancel: function() {
                            self.emit('shareCancel')
                        }
                    }

                    eval('wx.' + shareAr[i] + '(opt)');
                }
            });
            return self;
        },
        destroy: function() {
            for (var _j in this) {
                delete this[_j];
            }
        }
    };
    Emitter.applyTo(Weixin);
    module.exports = Weixin;
});