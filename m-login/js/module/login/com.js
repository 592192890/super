/**
 * @file com.js
 * @synopsis  login common
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-10-25
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('common/box/1.0.0/box');
    var io = require('lib/core/1.0.0/io/request');
    var context = require('lib/gallery/context/1.0.0/context');
    var smsUrl = context.getConf('url.smsUrl');

    function getUrlParm(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    var com = {
        telNum: '', // 电话号码
        verfCode: '', //短信验证码
        smsTime: 60, // 短信验证码时间限制
        loading: null, // loading
        init: function() {
            this.setDom();
            this.bindEvent();
        },
        setDom: function() {
            var opt = {
                reGetCode: $('#jReGet'),
                getCode: $('#jSendSms'),
                getCodeReg: $('#jSendSmsReg'),
                inputCode: $('#captcha'),
                mobile: $('#mobile')
            };
            $.extend(this, opt);
        },
        getData: function() {
            var returnUrl = getUrlParm('returnUrl') || '';
            return {
                "returnUrl": returnUrl,
                "mobile": this.mobile.val(),
                "captcha": this.inputCode.val()
            }
        },
        bindEvent: function() {
            var self = this;

            this.getCode.on('click', function() { // 获取验证码
                if (self.isTelephone()) {
                    var reg = self.getQuery('reg');
                    if(reg){
                        var opt = {
                            reg: reg
                        }
                    }
                    self.sendSms(opt || {});
                }
            })

            this.getCodeReg.on('click', function() { // 获取验证码
                if (self.isTelephone()) {
                    self.sendSms();
                }
            })

            this.inputCode.on('input propertychange', function() { // 输入验证码
                self.verifCode();
            })

            $('#jShowProto').on('click', function() { // 显示协议内容
                if (!$('#tipsProtocal').is(":visible")) {
                    $('#tipsProtocal').fadeIn(100);
                }
            })

            $('#jClose').on('click', function() { // 关闭协议内容
                if ($('#tipsProtocal').is(":visible")) {
                    $('#tipsProtocal').fadeOut(300);
                }
            })

            $('#jLogin').click(function() {
                $loginForm.html(renderTmpl(loginTpl, {}));
                self.init();
            });
        },
        toggleBtn: function() {
            $('#jSendSms').toggle();
            $('#jSendSmsReg').toggle();
            $('#jReGet').toggle();
            this.getCode.html('重新获取验证码');
            this.getCodeReg.html('重新获取验证码');
        },
        countDown: function() {
            var self = this;
            this.toggleBtn();
            this.timeId = setInterval(function() {
                self.smsTime--;
                self.reGetCode.html(self.smsTime != 0 ? self.smsTime + 's' : '');
                if (self.smsTime === 0) {
                    self.timeId && clearInterval(self.timeId);
                    self.toggleBtn();
                }
            }, 1000)
        },
        // 验证短信号码
        verifCode: function() {
            var loginBtn = $("#jLoginBtn");
            this.verfCode = this.inputCode.val();
            if (/^\d{5}$/g.test(this.verfCode)) {
                loginBtn.addClass("active");
                return true;
            } else {
                loginBtn.removeClass("active");
                return false;
            }
        },
        // 判断电话号码
        isTelephone: function() {
            this.telNum = this.mobile.val();
            if (/^1[34578]\d{9}$/g.test(this.telNum)) {
                return true;
            } else {
                box.error("手机号码不正确，请重新填写")
                return false;
            }
        },
        // 发送短息
        sendSms: function(obj) {
            var self = this;
            var json = {
                "mobile": this.telNum,
                "callback": 'json'
            }
            json = $.extend(json, obj);
            this.loading = box.loading('');
            io.post(smsUrl, json, function(rst) {
                self.loading.hide();
                if (rst.error === 0 || rst.error === "0") {
                    if (rst.data && rst.data.leftSecond) {
                        self.smsTime = parseInt(rst.data.leftSecond);
                        self.countDown();
                    }
                }
            }, function(e) {
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
                self.toggleBtn();
                self.getCode.show();
                self.getCodeReg.show();
                $('#jReGet').hide();
            });
        },
        clearCode: function() {
            this.inputCode.val('');
        },
        clearAll: function() {
            this.mobile.val('');
            this.inputCode.val('');
        },
        getQuery: function(name){
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg);
             if(r!=null)return  unescape(r[2]); return null;
        }
    }
    module.exports = com;
});
