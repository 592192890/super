/**
 * @file small.js
 * @synopsis  weixin small
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2018-01-09
 */

define(function(require, exports, module) {
    'use strict';
    var wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2');
    var io = require('lib/core/1.0.0/io/request');
    var param={}, obj={};
    param.miniprogram = 0

    function isMiniProgram(){
        if(navigator.userAgent.indexOf('miniprogram')>-1){
            return true
        }else{
            return false
        }
    }
    
    wx.ready(function(){
        if(window.__wxjs_environment === 'miniprogram'|| isMiniProgram()){
            param.miniprogram = 1 // 步步高+
        }
        io.get('//wx.yunhou.com/super/api/setMiniprogram', param,  // 如果是小程序，服务器在cookie中设置miniprogram：1
            function(res) {    
            },
            function (err) {        
            }
        );
    })
    
});