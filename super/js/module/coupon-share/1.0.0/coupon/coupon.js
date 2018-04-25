/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-03-30
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        selfCouponTpl = require('text!./self-coupon.tpl'),
        coupon;

    coupon = {
        init: function(){},

        data: function(res){
            var data = $.extend({}, res),obj = {},shops = [];
            if(res.stores){
                res.stores.forEach(function(v){
                    shops.push(v.name)
                })
            }
            if(res) {
                obj['ticketName'] = res.name || '';       
                obj['ticketPrice'] = res.price || 0; 
                obj['begintime'] = res.begintime && res.begintime.slice(0,10).replace(/-/g,'.')
                obj['endtime'] = res.endtime && res.endtime.slice(0,10).replace(/-/g,'.')
                obj['stores'] = shops.join("、");       
                obj['pieces'] = res.issued || 0; 
                obj['instruction'] = res.instruction;
            }
                
            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfCouponTpl, self.data(data));
        }
    }

    module.exports = coupon;
});

