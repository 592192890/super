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
        selfSecKillTpl = require('text!./self-sec-kill.tpl'),
        secKill;

    secKill = {

        init: function(){},

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                secKillProducts = data.tabContent.secKillProducts,
                secKillBrief = data.tabContent.secKillBrief,
                secKill = data.tabContent.secKill,
                arr=[];

            if(secKill && secKill.list && secKill.list.length){
                if(!secKill.list[0].id){
                    return
                }
            }
                
            if (secKillProducts && secKillProducts.list && secKillProducts.list.length ) {
                
                arr = secKillProducts.list.filter(function(ele){
                    if(ele.secKillActivityId == secKill.list[0].id){
                        return ele;
                    }
                })
                
                obj['lists'] = arr.slice(0,6);

            }
            
            if (secKillBrief) {

                obj['secKillBrief'] = secKillBrief; 

            } 
            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfSecKillTpl, self.data(data));
        }
    }

    module.exports = secKill;
});

