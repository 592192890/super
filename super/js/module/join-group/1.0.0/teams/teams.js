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
        teamsTpl = require('text!./teams.tpl'),
        teams;

    teams = {

        init: function(data){
            return this.event().getHtml(data);
        },

        event: function(){
            $('body').on('click','#jMore',function(){
                var lis = $('#jJoinTeam').find('li');
                $.each(lis, function(index, li){
                    if($(this).hasClass('hide')){
                        $(this).show()
                    }
                })
            })
            return this
        },

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                promotion = data.data.promotion;

            if(promotion) {
                obj['lists'] = promotion.lists || [];
            }
            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(teamsTpl, self.data(data));
        }
    }
    module.exports = teams;
});

