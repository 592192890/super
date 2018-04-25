/**
 * @file login.js
 * @synopsis  login
 * @author licuiting, 250602615@qq.com
 * @version 2.0.0
 * @date 2017-10-25
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        box = require('common/box/1.0.0/box'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context');

    var wxLoginUrl = context.getConf('url.wxLogin'),
        loginUrl = context.getConf('url.loginUrl'),
        inviteUrl = context.getConf('url.myInviteUrl'),
        Store = require('module/login/store'),
        template = require('common/template/1.0.1/template'),
        loginTpl = require('text!module/login/login.tpl'),
        yiliUrl = context.getConf('url.checkyili'),
        isNeedCheckYili = context.getConf('isNeedCheckYili');

    var $loginForm = $('#jLoginForm');
    var $wxLogin = $('#jWxLogin');
    var com = require('module/login/com');
    var register = require('module/login/register');

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function getCookie(name) {
        var arrstr = document.cookie.split("; ");
        for (var i = 0; i < arrstr.length; i++) {
            var temp = arrstr[i].split("=");
            if (temp[0] == name) return unescape(temp[1]);
        }
    }

    function getUrlParm(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    //judge is app
    var isApp = getCookie('meixibbg_1.0') || '';
    if (isApp == 'isApp') {
        location.href = 'bbgapp://doAction?data={"functionname":"vLogin"}';
        return false;
    }

    //weChat login
    $wxLogin.on('click', function() {
        location.href = wxLoginUrl
    })

    //login begin -----------
    var login = {
        init: function() {
            var self = this;
            self.reg = com.getQuery('reg');
            $loginForm.html(renderTmpl(loginTpl, {reg: self.reg}));
            com.init();
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            $("#jLoginBtn").click(function() { // 验证并登录
                if ($(this).hasClass('active') && com.isTelephone() && com.verifCode()) {
                    self.login();
                }
            });
            $('#jGoto').click(function() {
                register.init();
            });
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
        login: function() {
            var self = this, opt = {}
            if(self.reg){
                opt = {
                    reg: self.reg,
                    login: true,
                    opt:''
                }
            }
            var param = $.extend(com.getData(), opt),
                returnUrl = com.getData().returnUrl;
            if ($('.jYili').is(':checked')) {
                param.pushYili = 1;
            } else {
                param.pushYili = 2;
            }
            this.loading = box.loading('');
            io.post(loginUrl, param, function(rs) {
                self.loading.hide();
                if (rs.error === 0 || rs.error === "0") {
                    if (rs.data && rs.data.goInvite && rs.data.returnUrl) {
                        window.location.href = inviteUrl + '?returnUrl=' + rs.data.returnUrl;
                    } else if (rs.data && rs.data.returnUrl) {
                        com.clearAll();
                        var url = rs.data.returnUrl;
                        window.location.href = url;
                    }
                }
            }, function(e) {
                self.loading.hide();
                e.msg && box.error(e.msg);
                com.clearCode();
				$("#jLoginBtn").removeClass('active');
            });
        }
    }

    //login end -----------

    login.init();

    register.on('toLogin', function() {
        login.init();
    });
});
