/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-04-06
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        context = require('lib/gallery/context/1.0.0/context'),
        priceBox = $('#jPriceBox'),
        priceBuy = $('#jPrice'),
        propBuy = $('#jProPrice'),
        itemPrice;


    itemPrice = {
        init: function() {},

        exec: function(rs) {
            var data = $.extend({}, rs),
                obj = {},
                price,
                originalPrice,
                promotion_price,
                promotion = data.data.promotion,
                promotionPrice = promotion.price,
                unit = data.data.product.unit ? ' / '+ data.data.product.unit:'';

            // isWeightInd散装称重商品
            if (context.getConf('isWeightInd') == '1' && promotionPrice) {
                priceBuy.text(promotionPrice.unitPrice + '/kg');
                $("#totalSellingPrice").text(promotionPrice.price + '元');
                // propBuy.text('');
                return;
            }

            if (data.data.product.price) {
                price = data.data.product.price; //销售价
            } else {
                price = priceBuy.text().replace("￥", "");
            }

            if (promotion && promotion.price) {

                //有活动时的价格
                promotion_price = promotion.price.price || price;
                priceBuy.text('￥' + promotion_price + unit);

                //当市场价不存在则用销售价替换
                if (propBuy.text() == "") {
                    var propPrice = propBuy.text().replace('￥', '')
                    propBuy.text('￥' + price + unit);
                }
            } else {
                //没有活动时的价格
                priceBuy.text('￥' + price + unit);
            }
            // 原价显示
            originalPrice = parseFloat(propBuy.text().replace('￥', ''));
            var countPrice = parseFloat(priceBuy.text().replace('￥', ''));
            if (originalPrice <= countPrice) {
                propBuy.text('');
            }else{
                propBuy.text('￥' + originalPrice  + unit);
            }
        }
    }
    module.exports = itemPrice;
});