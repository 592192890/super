/**
 * @file login.js
 * @synopsis 大会员登录界面（php）
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-03-20
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        box = require('common/box/1.0.0/box'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context');

    var smsUrl = context.getConf('url.smsUrl'),
        wxLoginUrl = context.getConf('url.wxLogin'),
        loginUrl = context.getConf('url.loginUrl'),
        inviteUrl = context.getConf('url.myInviteUrl'),
        yiliUrl = context.getConf('url.checkyili'),
        isNeedCheckYili = context.getConf('isNeedCheckYili'); 


    var login = {

        telNum: '', // 电话号码

        verfCode: '', //短信验证码

        pushYili: '', //伊利会员

        smsTime: 60, // 短信验证码时间限制

        loading: null, // loading

        reGetCode: $('#jReGet'),

        getCode: $('#sendSms'),

        inputCode: $('#captcha'),

        loginBtn: $("#jLoginBtn"),

        mobile: $('#mobile'),

        wxLogin: $('#jWxLogin'),

        init: function () {
            var isApp = this.getCookie('meixibbg_1.0') || '';
            if (isApp == 'isApp') {
                location.href = 'bbgapp://doAction?data={"functionname":"vLogin"}';
                return false;
            }
            this.bindEvent();
        },

        getCookie: function (name) {
            var arrstr = document.cookie.split("; ");
            for (var i = 0; i < arrstr.length; i++) {
                var temp = arrstr[i].split("=");
                if (temp[0] == name) return unescape(temp[1]);
            }
        },

        bindEvent: function () {
            var self = this;

            this.wxLogin.on('click', function () {
                location.href = wxLoginUrl
            })

            this.getCode.on('click', function () { // 获取验证码
                if (self.isTelephone()) {
                    self.sendSms();
                } else {
                    box.error("手机号码不正确，请重新填写")
                }
            })

            this.inputCode.on('input propertychange', function () { // 输入验证码
                self.verifCode();
            })
            this.loginBtn.on('click', function () { // 验证并登录
                if ($(this).hasClass('active')) {
                    self.login();
                }
            })
            this.reGetCode.on('click', function () { // 重新获取验证码
                if ($(this).hasClass('over')) {
                    if (self.isTelephone()) {
                        self.sendSms();
                    } else {
                        box.error("手机号码不正确，请重新填写")
                    }
                }
            })
            $('#jShowProto').on('click', function () { // 显示协议内容
                if (!$('#tipsProtocal').is(":visible")) {
                    $('#tipsProtocal').fadeIn(100);
                }
            })

            $('#jClose').on('click', function () { // 关闭协议内容
                if ($('#tipsProtocal').is(":visible")) {
                    $('#tipsProtocal').fadeOut(300);
                }
            })

            $('#mobile').on('input',function () { //判断显示伊利
                if ($(this).val().length == 11&&isNeedCheckYili== 1) {//母婴渠道
                    io.post(yiliUrl, {
                        'mobile': $(this).val()
                    }, function (rst) {
                        if (rst.data.yiliStatus === 0) {
                            $('.jYiliBox').show();
                        } else {
                            $('.jYiliBox').hide();
                        }
                    }, function (e) {
                        e.msg && box.error(e.msg);
                    });
                }
            })
        },

        countDown: function () {
            var self = this;
            if (this.getCode.is(":visible")) {
                this.getCode.hide();
            }
            if (!this.reGetCode.is(":visible")) {
                this.reGetCode.show();
            }
            this.timeId = setInterval(function () {
                self.smsTime--;
                self.reGetCode.html(self.smsTime + 's');
                if (self.smsTime === 0) {
                    self.timeId && clearInterval(self.timeId);
                    self.reGetCode.html('重新获取验证码').addClass('over')
                }
            }, 1000)
        },

        // 验证短信号码
        verifCode: function () {
            this.verfCode = this.inputCode.val();
            if (/^\d{5}$/g.test(this.verfCode)) {
                this.loginBtn.addClass("active");
            } else {
                this.loginBtn.removeClass("active");
            }
        },

        // 判断电话号码
        isTelephone: function () {
            this.telNum = this.mobile.val();
            if (/^1[34578]\d{9}$/g.test(this.telNum)) {
                return true;
            } else {
                return false;
            }
        },

        // 发送短息
        sendSms: function () {
            var self = this;
            var json = {
                "mobile": this.telNum,
                "callback": 'json'
            }
            this.loading = box.loading('');
            io.post(smsUrl, json, function (rst) {
                self.loading.hide();
                if (rst.error === 0 || rst.error === "0") {
                    if (rst.data && rst.data.leftSecond) {
                        self.smsTime = parseInt(rst.data.leftSecond);
                        self.countDown();
                    }
                }
            }, function (e) {
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
                if (!self.reGetCode.is(":visible")) {
                    self.reGetCode.html('重新获取验证码').addClass('over').show();
                    self.getCode.hide();
                }
            });
        },

        login: function () {
            var self = this,
                returnUrl = this.getUrlParm('returnUrl') || '',
                param;
            this.telNum = this.mobile.val();
            this.verfCode = this.inputCode.val();
            if ($('.jYili').is(':checked')) {
                this.pushYili = 1;
            } else {
                this.pushYili = 2;
            }

            param = {
                "mobile": this.telNum,
                "captcha": this.verfCode,
                "returnUrl": returnUrl,
                "pushYili": this.pushYili
            };
            this.loading = box.loading('');
            io.post(loginUrl, param, function (rs) {
                self.loading.hide();
                if (rs.error === 0 || rs.error === "0") {
                    if (rs.data && rs.data.goInvite && rs.data.returnUrl) {
                        window.location.href = inviteUrl + '?returnUrl=' + rs.data.returnUrl;
                    } else if (rs.data && rs.data.returnUrl) {
                        self.mobile.val('');
                        self.inputCode.val('');
                        var Store = new self.store();
                        //Store.set("LoginBool", true);
                        //Store.set("localMobile", self.telNum);
                        var url = rs.data.returnUrl;
                        window.location.href = url;
                    }
                }
            }, function (e) {
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
            });
        },

        getUrlParm: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },

        //本地存储
        store: function () {

            function _localStorage() {
                this.s = localStorage;
                return this;
            }

            _localStorage.prototype = {
                init: function (options) {
                    this.options = {
                        expires: 200 * 60 * 60000, //60000毫秒1分钟 2*60*60000 默认2小时
                        domain: window.location.host,
                        path: "/",
                        secure: "",
                        val: ""
                    };
                    for (var x in options) {
                        this.options[x] = options[x];
                    }
                },
                check: function (key) {
                    return this.get(key);
                },
                set: function (key, val, _options) {
                    this.init(_options);
                    var date = new Date();
                    this.options.expires = date.getTime() + this.options.expires;
                    this.options.val = val;
                    this.s.setItem(key, JSON.stringify(this.options));
                    return this.options;
                },
                get: function (key) {
                    var _date = new Date(),
                        currentTime = _date.getTime();
                    var _value = this.s.getItem(key);
                    if (typeof _value != 'string') {
                        return undefined
                    }
                    return JSON.parse(_value);
                },
                getAll: function () {
                    var ret = {};
                    for (var i = 0; i < this.s.length; i++) {
                        var key = this.s.key(i);
                        ret[key] = this.get(key);
                    }
                    return ret;
                },
                remove: function (key) {
                    this.s.removeItem(key);
                },
                clear: function () {
                    this.s.clear();
                }
            };

            function _cookieStore(options) {
                this.s = document.cookie;
            }

            _cookieStore.prototype = {
                init: function (options) {
                    this.options = {
                        expires: 2 * 60 * 60000, //60000毫秒1分钟  默认2小时
                        domain: window.location.host,
                        path: "/",
                        secure: "",
                        val: ""
                    };
                    for (var x in options) {
                        this.options[x] = options[x];
                    }
                },
                check: function (key) {
                    return this.get(key);
                },
                set: function (name, value, _options) {
                    this.init(_options);
                    var date = new Date();
                    this.options.expires = date.getTime() + this.options.expires;
                    this.options.val = value;
                    var valueToUse = "",
                        expires = this.options.expires,
                        path = this.options.path,
                        secure = this.options.secure;

                    if (this.options.val !== undefined && typeof (this.options.val) === "object") {
                        valueToUse = JSON.stringify(this.options)
                    } else {
                        valueToUse = encodeURIComponent(this.options)
                    }
                    this.s = name + "=" + valueToUse + (expires ? ("; expires=" + new Date(expires).toUTCString()) : '') +
                        "; path=" + (path || '/') + (secure ? "; secure" : '');
                },
                get: function (name) {
                    var _date = new Date(),
                        currentTime = _date.getTime();
                    var cookies = this.getAllRawOrProcessed(false);
                    if (cookies.hasOwnProperty(name)) {
                        return this.processValue(cookies[name]);
                    } else {
                        return undefined;
                    }
                },
                processValue: function (value) {
                    if (value.substring(0, 1) == "{") {
                        try {
                            return JSON.parse(value);
                        } catch (e) {
                            return value;
                        }
                    }
                    if (value == "undefined") return undefined;
                    return decodeURIComponent(value);
                },
                getAllRawOrProcessed: function (process) {
                    //process - process value or return raw value
                    var cookies = document.cookie.split('; '),
                        s = {};
                    if (cookies.length === 1 && cookies[0] === '') return s;
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].split('=');
                        if (process) s[cookie[0]] = this.processValue(cookie[1]);
                        else s[cookie[0]] = cookie[1];
                    }
                    return s;
                },
                getAll: function () {
                    return this.getAllRawOrProcessed(true);
                },
                remove: function (name) {
                    this.set(name, "", -1);
                },
                clear: function () {
                    var cookies = this.getAll();
                    for (var i in cookies) {
                        this.remove(i);
                    }
                    return this.getAll();
                }
            };

            if (typeof localStorage == 'undefined') {
                return new _cookieStore();
            } else {
                return new _localStorage();
            }
        }
    }

    login.init();

});