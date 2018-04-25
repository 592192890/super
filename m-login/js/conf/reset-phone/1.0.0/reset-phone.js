/**
 * @file reset-phone.js
 * @synopsis  重置手机号
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-04-11
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        box = require('common/box/1.0.0/box'),    
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie');
 
   //定义接口
    var smsUrl = $('#jGetCode').attr('data-url'),//验证码接口地址
        loginUrl = $("#jLoginBtn").attr('data-url');
    var login = {

        telNum: '', // 电话号码

        verfCode: '', //短信验证码

        smsTime: 60, // 短信验证码时间限制

        loading: $('#jLoading'), // loading动画

        reGetCode: $('#jReGet'),//倒计时按钮，状态禁用

        getCode: $('#jGetCode'),//获取验证码按钮



        inputCode: $('#captcha'),//验证码输入框

        loginBtn: $("#jLoginBtn"),//提交按钮

        mobile:$('#mobile'),//手机号输入框
        sid:'',

        

        init: function(){
            this.bindEvent();
        },
        //判断是手机号码格式
        isTelephone: function(){
            this.telNum = $("#mobile").val();
            if(/^1[34578]\d{9}$/g.test(this.telNum)){
                return true;
            }else{
                return false;
            }
        },
        // 验证短信号码
        verifCode: function(){
            this.verfCode = this.inputCode.val();
            if(/^\d{5}$/g.test(this.verfCode)){
                this.loginBtn.removeAttr("disabled").removeClass('disable');
            }else{
                this.loginBtn.attr('disabled','disabled').addClass('disable');
            } 
        },
         //倒计时开始
        countDown: function(){
            var self = this;
            if(this.getCode.is(":visible")){
                this.getCode.hide();
            }
            if(!this.reGetCode.is(":visible")){
                this.reGetCode.show();
            }else{
                if (this.reGetCode.hasClass('ui-btn-primary-line')) {
                    this.reGetCode.removeClass('ui-btn-primary-line').addClass('ui-btn-line').attr('disabled','disabled');
                };
            }
            this.timeId = setInterval(function(){
                self.smsTime--;
                self.reGetCode.html(self.smsTime + 's');
                if(self.smsTime===0){
                    self.timeId && clearInterval(self.timeId);
                    self.reGetCode.html('重新获取').removeClass('ui-btn-line').addClass('ui-btn-primary-line').removeAttr("disabled")
                }  
            },1000)
        },
    
        //发送请求
        sendSms: function(){
            var self = this;
            this.telNum = this.mobile.val();
            var json = {
                "mobile" : this.telNum,
            }
            this.loading.show();
            io.post(smsUrl, json, function(rst){
                self.loading.hide();
                if(rst.data&&rst.data.leftSecond){
                    self.smsTime = parseInt(rst.data.leftSecond);
                    self.countDown();
                }
                if (rst.data.sid) {
                    self.sid = rst.data.sid;
                };
                
            }, function(e){
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
                if(!self.reGetCode.is(":visible")){
                    self.reGetCode.html('重新获取').removeClass('ui-btn-line').addClass('ui-btn-primary-line').removeAttr("disabled").show();
                    self.getCode.hide();
                }
            });
        },
        //提交按钮逻辑
        login: function(){
            var self = this,
            // self.sid = this.sid;
                param;
            this.telNum = this.mobile.val();
            this.verfCode = this.inputCode.val();
            param = {
                "mobile" : this.telNum,
                "captcha" : this.verfCode,
                "sid":self.sid
            };    
            this.loading.show();
            io.post(loginUrl, param, function(rs){
                self.loading.hide();
                if(rs.data && rs.data.src){
                    self.mobile.val('');
                    self.inputCode.val('');
                    var url = rs.data.src;
                    location.href = url;
                }  
            }, function(e){
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
            });
        },
        //绑定发送
        bindEvent: function(){
            var self = this;
            this.getCode.on('click', function(){//获取验证码按钮绑定事件
                if(self.isTelephone()){
                    self.sendSms();
                }else{
                    box.error("手机号码不正确，请重新填写")
                }
            })
            this.inputCode.on('input propertychange', function(){    // 输入验证码
                self.verifCode();
            })
            this.loginBtn.on('click', function(){  // 验证并登录
                if(!$(this).hasClass('disabled')){
                    self.login();
                }
            })
            this.reGetCode.on('click', function(){  // 重新获取验证码
                if($(this).hasClass('ui-btn-primary-line')){
                    if(self.isTelephone()){
                        self.sendSms();
                    }else{
                        box.error("手机号码不正确，请重新填写")
                    }
                }
            })

        },
       
    }

    login.init();

   
});