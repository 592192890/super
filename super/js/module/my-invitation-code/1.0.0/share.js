/**
 * @file wx.js
 * @synopsis  weixin share
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * modify zgc
 * @date 2017-06-14
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var io = require('lib/core/1.0.0/io/request');
    var Wx = require('common/wx/1.0.0/js/wx');
    var context = require('lib/gallery/context/1.0.0/context');
    var share = context.getConf('share');
    var box = require('common/box/1.0.0/box');
    var wx, params={};
    // 微信分享
    if(share){
        params = {
            type: share.type,
            targetId: share.targetId
        }
    }
    params.url = window.location.href;
    var wxShare = function(obj){
        // if(window.location.href.indexOf('.yunhou.com')<0){   //  防止进入支付钱包分享报错
        //     return
        // }
        var obj = obj ? obj : {};
        if(wx){
            wx.destroy()
            wx = null
        }
        wx = new Wx();
        wx.share({
            title: obj.title || '',
            desc: obj.desc || '',
            link: obj.link || '',
            imgUrl: obj.imgUrl || ''
        }).on('shareSuccess', function(source){
            params.source = source ? source :'';
            io.jsonp('//wx.yunhou.com/super/point/getPointByShare',params,
                function() {
                    //box.tips('分享成功');
                },
                function (e) {
                    //box.tips('分享成功');
                }
            );
        }).on('shareCancel', function(){
            //box.tips('取消分享')
        });
    }

    
    module.exports = wxShare;
});