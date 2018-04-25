/* 
 * @Author: zgc
 * @synopsis  发票详情
 * @Date:   2017-10-19 17:04:27
 */

define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        io = require('common/kit/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/2.0.0/js/box'),
        opt;

    opt = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            $('.jPushBtn').click(function () {
                var pushEmail = $('.jEmailIpt').val();
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                　　
                if (pushEmail === "") { //输入不能为空
                    box.error("请输入邮箱地址!");　　　　
                    return false;　　
                } else if (!reg.test(pushEmail)) { //正则验证不通过，格式不对
                    box.error("邮箱格式有误，请重新输入!");　　　　
                    return false;　　
                } else {
                    var data = {
                        id : context.getConf('id'),
                        pushEmail : pushEmail
                    };
                    io.post(context.getConf('url.pushEmailUrl'), data, function (res) {
                        box.ok(res.msg);
                        //换一个推送状态
                        var tpl = '<p class="push-hd">发票推送</p><div class="push-bd">'+
                        '<p>电子发票已经发送至<span class="red jEmail">'+pushEmail+'</span>邮箱，</p>'+
                        '<p>请至该邮箱查看或下载电子发票~</p></div>';
                        $('.jStatus').text('已推送');
                        $('.jInvoicePush').html(tpl);
                    }, function (res) {
                        box.error(res.msg);
                    });　　
                }
            })

        }
    };


    opt.init(); //初始化
})