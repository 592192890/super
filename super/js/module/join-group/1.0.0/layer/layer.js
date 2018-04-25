/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-06-01
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        selfLayer = require('text!./layer.tpl'),
        context = require('lib/gallery/context/1.0.0/context'),
        layer;

    layer = {

        tpl: null,  // 

        init: function(data){
            this.tpl = this.getHtml(data);
            this.event();
        },

        event: function(){
            var self = this;
            $("body").on("click", "#jMode li", function(){
                $(this).addClass("active").siblings().removeClass("active");
            });

            $("body").on("click", "#jConfirm", function(){
                
            });
        },

        data: function(rs){
            return;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfLayer, self.data(data));
        }
    }

    module.exports = layer;
});

