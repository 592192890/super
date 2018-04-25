/**
 * @des add2cart
 * @author	unknown
 *
 * @update  taotao  2015-09-24
 * @modify yanghaitao 2017-04-17
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var box = require('common/box/1.0.0/box');
    var cookie = require('common/kit/io/cookie');
    var context = require('lib/gallery/context/1.0.0/context');


    var getcart = function() {
        var d = {
            'source': 'wap'
        };
        var countWrap = $('.ui-num'),
            goAccount = context.getConf('url.goAccount');

        io.jsonp(goAccount, d, function(data) {
            if (!!data.data) {
                if(!data.data.totalQuantity||data.data.totalQuantity===0||data.data.totalType === '0'){
                    $('#jAccounts').removeClass('active');
                    countWrap.hide()
                    return
                }
                countWrap.text(data.data.totalQuantity);
                if (data.data.totalType === 0 || data.data.totalType === '0') {
                    $('#jAccounts').removeClass('active');
                    countWrap.hide()
                } else {
                    $('#jAccounts').addClass('active');
                    countWrap.show()
                }
            }
        },function(e){
            $('#jAccounts').removeClass('active');
            countWrap.hide()
            box.tips(e.msg);
        });
    };

    //  加入购物车
    var addcart = function(productId, quantity, obj) {
        var data = {
            'productId': productId,   //商品ID
            'quantity': quantity,      //商品数量
            'source': 'wxfx'                //来源
        };

        var addCartUrl = context.getConf('url.addcart');

        io.jsonp(addCartUrl, data, function() {
            box.tips('添加成功</br>商品已成功加入购物车！');
            getcart();

        },function(e){
            box.tips(e.msg);
        },obj);
    };

    //立即购买
    var buyNow = function(productId, quantity, obj) {
        var name = cookie('_nick'),
        buyNowUrl = context.getConf('url.buyNow'),
        login = context.getConf('url.login'),
        buyNow = context.getConf('url.buy-now'),
        buyAtOnceUrl = context.getConf('url.buy-at-once');
        
        if (!name) {
            location.href = login + '?returnUrl=' + encodeURIComponent(location.href);
            return;
        }
        var data = {
            'productId': productId,   //商品ID
            'quantity': quantity,     //商品数量
            'source': 'wap'           //来源
        };

        io.jsonp(buyNowUrl, data, function(data){

            if (data.data.deliveryType == 0) {
                location.href = buyNow;
            } else {
                location.href = buyAtOnceUrl;
            }

        },function(e){
            if (e.error == -100) {
                box.tips('您还未登录，3秒后自动跳转登录页面') 
                setTimeout(function(){
                   window.location.href= login + encodeURIComponent(window.location.href);
                },800)
            } else {
                box.tips(e.msg) 
                setTimeout(function(){
                   window.location.href= login + encodeURIComponent(window.location.href);
                },800) 
            }
        },obj);
    };

    module.exports = {
        getcart : getcart,
        addcart : addcart,
        buyNow : buyNow
    }

});
