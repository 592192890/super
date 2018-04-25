/**
 * @file wx.js
 * @synopsis  weixin share
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
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
    var wx, params={}, link='', title='', desc='', imgUrl='';
    // 微信分享
    if(share){
        params = {
            type: share.type,
            targetId: share.targetId
        }
    }

    var getQueryString = function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    
    // 优惠券详情，优惠券领取分享文案
    if(/\/coupon\/detail/g.test(window.location.href)||/\/coupon\/share_page/g.test(window.location.href) ){
        var couponId = getQueryString('couponId') || getQueryString('id')
        var couponType = getQueryString('couponType') || getQueryString('type')
        var sharerName = ''
        io.get('//wx.yunhou.com/super/Memberapi/get_info',
            function(res) {
                if(res.data){
                     sharerName = res.data.memberName || res.data.mobile
                }
                desc = 'hi \'' + sharerName + '\' 赠送给你一张步步高优惠券，领券购物享受更多优惠！'
                link = '//wx.yunhou.com/super/coupon/share_page?couponId='+ couponId +'&sharerName='+sharerName+'&couponType='+couponType
            },
            function (e) {
                
                desc = '赠送给你一张步步高优惠券，领券购物享受更多优惠！'
                link = '//wx.yunhou.com/super/coupon/share_page?couponId='+ couponId +'&sharerName='+sharerName+'&couponType='+couponType
            }
        );
        title = '步步高优惠券大礼包分享'
        imgUrl = ''
    }
    
    // 我的邀请码
    if(/\/invite\/my/g.test(window.location.href)){
        var shareParams = context.getConf('shareData')
        title = shareParams.title || ''
        desc= shareParams.desc || ''
        imgUrl= shareParams.imgUrl || ''
        link = shareParams.link || ''
    }

    // 分享商品
    if(/\/item/g.test(window.location.href)){
        var shareParams = context.getConf('shareData')
        title = shareParams.title || ''
        desc= shareParams.desc || ''
        imgUrl= shareParams.imgUrl || ''
        link = shareParams.link || ''
    }
    
    params.url = window.location.href;
    var wxShare = function(obj){
        if(window.location.href.indexOf('.yunhou.com')<0){   //  防止进入支付钱包分享报错
            return
        }
        var obj = obj ? obj : {};
        if(wx){
            wx.destroy()
            wx = null
        }
        wx = new Wx();
        setTimeout(function(){
            wx.share({
                title: title || '',
                desc: desc || '',
                link: link,
                imgUrl: imgUrl || ''
            }).on('shareSuccess', function(source){
                params.source = source ? source :'';
                io.jsonp('//wx.yunhou.com/super/point/getPointByShare',params,
                    function() {
                        box.tips('分享成功');
                    },
                    function (e) {
                        box.tips('分享成功');
                    }
                );
            }).on('shareCancel', function(){
                //box.tips('取消分享')
            });
        },2000)   
    }

    
    module.exports = wxShare;
});