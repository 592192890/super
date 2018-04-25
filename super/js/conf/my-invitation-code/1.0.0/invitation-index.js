/**
 * @file invitation-index.js
 * @synopsis  我的邀请码
 * @author zgc, zgc7788@gmail.com
 * @version 1.0.0
 * @date 2017-08-11
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/2.0.0/js/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        submitUrl = context.getConf('url.addInviteCodeUrl'),
        $jMaskLayer = $('.jMaskLayer'),
        opt;

    opt = {
        init:function(){
           this.submit();
           this.bindEvent();
        },
        bindEvent:function(){
            $('.jShareBtn').click(function(){
                $jMaskLayer.css('display','block');
            })
            $jMaskLayer.click(function(){
                $(this).hide();
            })
        },
        submit:function(){
            $('.jInviteBtn').click(function(){
                var inviteCode = $('.jInviteCode').val();
                if(!inviteCode) {box.error('请输入邀请码');return;}
                io.post(submitUrl, {code:inviteCode}, function(data) {
                    box.ok('为好友助力成功');
                    // $('.jInviteText').text(data.data.tel);
                    // $('.jInviteCodeBox').hide();
                    // $('.jInviterBox').show();
                    var timer = setTimeout(function() {
                        window.location.reload(); 
                    }, 1000);
                },function(e){
                    box.error(e.msg);
                },this);
            })
        }
    }
    
    opt.init();//初始化
});