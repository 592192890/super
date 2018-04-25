/**
 * @author huahua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-12-5
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        selfPromotionTpl = require('text!./self-promotion.tpl'),
        promotionBanner;

    promotionBanner = {
        init: function() {},
        data: function(rs) {
            var data = $.extend({}, rs),
                obj = {},
                promotion = data.data.promotion;

            if (promotion) {
                obj['list'] = promotion.list || [];
            }
            return obj;
        },
        renderTmpl: function(tpl, data) {
            return template.compile(tpl)(data || {});
        },
        getHtml: function(data) {
            var self = this;
            return this.renderTmpl(selfPromotionTpl, self.data(data));
        }
    }
    module.exports = promotionBanner;
});