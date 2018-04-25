/**
 * @file invitation-front.js
 * @synopsis  我的邀请码
 * @author XXX, example@163.com
 * @version 1.0.0
 * @date 2017-08-04
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/2.0.0/js/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        //cookie = require('lib/core/1.0.0/io/cookie'),
        returnUrl = location.href.split('returnUrl=')[1] || '//wx.yunhou.com/super/member',
        opt;

    opt = {
        init:function(){
            this.inviteSubmit();
            this.jumpOver();
            this.bindEvent();
        },
        bindEvent:function(){
            $('.jInviteCode').on('input',function(){
                if($(this).val()){
                    $('.jSubmit').removeClass('submit-btn-disable');
                }else{
                    $('.jSubmit').addClass('submit-btn-disable');
                }
            })
        },
        inviteSubmit:function(){
            $('.jSubmit').click(function(){
                var _this = this,
                    inviteCode = $('.jInviteCode').val(),
                    submitUrl = context.getConf('url.addInviteCodeUrl');
                if(inviteCode==''){ box.tips('请填写邀请码后提交，若无邀请码，直接跳过'); return;}
                io.post(submitUrl, {code:inviteCode}, function(data) {
                    box.ok('邀请码提交成功');
                    var timer =  setTimeout(function() {
                        window.location.href = returnUrl;//跳个人中心
                    }, 1000);
                },function(e){
                    box.error(e.msg);
                },_this);
            })
        },
        jumpOver:function(){
            $('.jumpOver').click(function(){
                window.location.href = returnUrl;
            })
        }
    }
    
    opt.init();//初始化
});