/**
 * @file register.js
 * @synopsis  register
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
    var template = require('common/template/1.0.1/template');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    //
    var loginUrl = context.getConf('url.loginUrl');
    var inviteUrl = context.getConf('url.myInviteUrl');
    var $loginForm = $('#jLoginForm');
    var registerTpl = require('text!module/login/register.tpl');
    var com = require('module/login/com');

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    var register = {
        init: function() {
            var self = this;
            $loginForm.html(renderTmpl(registerTpl, {}));
            com.init();
            this.bindEvent();
        },
        validateName: function() {
					var flag = $.trim($('#jName').val()).length!=0;
					!flag && box.error('姓名不能为空!');
					return flag;
        },
        validateGender: function() {
					var flag = $.trim($('[name=gender]:checked').val()).length!=0;
					!flag && box.error('请选择性别!');
					return flag;
        },
        bindEvent: function() {
            var self = this;
            $("#jLoginBtn").click(function() { // 验证并注册
                if ($(this).hasClass('active') && self.validateName() && self.validateGender() && com.isTelephone() && com.verifCode()) {
                    self.login();
                }
            });
            $('#jGoto').click(function() {
                self.emit('toLogin');
            });
        },
        login: function() {
            var self = this;
            var returnUrl = com.getData().returnUrl;
            var param = {
                "username": $.trim($('#jName').val()),
                "gender": $('[name=gender]:checked').val(),
                "reg": com.getQuery('reg')
            };
            $.extend(param, com.getData());
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
    };
    Emitter.applyTo(register);
    module.exports = register;
});
