/**
 * @file activity.js
 * @synopsis  模块名称
 * @author liuhui, 1026527082@qq.com
 * @version 1.0.0
 * @date 2017-02-23
 * modify by  XX
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var listenerBackHandler ;
    listenerBackHandler = {
        param: {  
            isRun: false, //防止微信返回立即执行popstate事件  
        },  
        listenerBack: function () {  
            var state = {  
                title: "title",  
                url: "#"  
            };  
            window.history.pushState(state, "title", "#");  
            window.addEventListener("popstate", function (e) { 
                if (listenerBackHandler.param.isRun) {  
                    window.location.replace('https://wx.yunhou.com/super/member/tickets'); //返回到主页  
                }  
            }, false);  
        },  
        //初始化返回事件  
        initBack: function () {   
            listenerBackHandler.param.isRun = false;  
            setTimeout(function () { listenerBackHandler.param.isRun = true; }, 1000); //延迟1秒 防止微信返回立即执行popstate事件  
            listenerBackHandler.listenerBack();  
        }  
    }
    listenerBackHandler.initBack(); 
});