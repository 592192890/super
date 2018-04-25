/**
 * @file birth-privilege.js
 * @synopsis  生日特权
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-05-27
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        // box = require('common/box/1.0.0/box');
        box = require('common/box/2.0.0/js/box');
        
    $("#jApply").click(function() {
        io.get("//wx.yunhou.com/super/member/privilege?isAjax=1","",function(){
            box.alert(
                '已为你备好精美礼品，请前往附近门店领取',
                {
                    title: '提示',
                    hideClose: true //是否隐藏关闭按钮
                }
            )},function(res){
                box.warn(res.msg);
                window.location.href = res.data.returnUrl; 
        })
        
    });
    $("#jGet").click(function() {
        io.get("//wx.yunhou.com/super/member/receiveCoupons",
            "",
            function(res){
                box.ok(res.msg);
        },function(res){
            box.warn(res.msg);
            window.location.href = res.data.returnUrl; 
        })
    });

});

