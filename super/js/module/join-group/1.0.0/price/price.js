/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-06-01
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        selfPriceTpl = require('text!./self-price.tpl'),
        price;

    price = {
        init: function(){},

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                promotion = data.data.promotion;
                
            if (promotion && promotion.groupbuy) {
                // 预售商品 
                if(promotion.groupbuy.type == 'deposit'){  // 定金预售 
                    if(promotion.depositParam){
                        obj['isPreSale'] = true; // 是预售商品                   
                        obj['totalPrice'] = promotion.depositParam.totalPrice || 0; //预售总价
                        obj['prePrice'] = promotion.depositParam.deposit || 0;  //预售定金价格
                        obj['retainage'] = promotion.depositParam.retainage || 0; //尾款
                        obj['retainageTips'] = promotion.depositParam.retainageTips || ''; //尾款截止时间                                  
                        obj['soldNums'] = promotion.groupbuy.num || 0; // 已售多少
                    }
                }

                if(promotion.groupbuy.type == 'prebuy'){   // 全款预售 
                    obj['isPreSale'] = false;       
                    obj['totalPrice'] = promotion.price.price || 0; //预售总价
                    obj['soldNums'] = promotion.groupbuy.num || 0; // 已售多少
                    $('.mod-process').hide()
                }
            }
                
            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfPriceTpl, self.data(data));
        }
    }

    module.exports = price;
});

