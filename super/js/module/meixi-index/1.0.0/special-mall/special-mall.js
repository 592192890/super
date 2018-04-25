/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-07-11
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        selfSpecialMallTpl = require('text!./self-special-mall.tpl'),
        specialMall;

    specialMall = {

        init: function(){},

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                specialMall = data.tabContent.specialMall;
                
            if (specialMall && specialMall.list) {

                obj['lists'] = specialMall.list; 

            }

            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfSpecialMallTpl, self.data(data));
        }
    }

    module.exports = specialMall;
});

