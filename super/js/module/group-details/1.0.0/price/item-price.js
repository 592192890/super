/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-04-06
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        priceBox = $('#jPriceBox'),
        priceBuy = $('#jPrice'),
        propBuy = $('#jProPrice'),
        itemPrice;


    itemPrice = {
        init: function(){},

        exec: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                promotion = data.data.promotion;
            //原价
            if (data.data.product.price) {
                propBuy.text("￥"+data.data.product.price);
            }else{
                propBuy.text("");
            }
            //团购价
            priceBuy.text("团购价￥"+promotion.price.price);
        }
    }
    module.exports = itemPrice;
});

