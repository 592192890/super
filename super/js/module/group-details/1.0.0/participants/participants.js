/**
 * @author zhouwei, 1097009033@qq.com
 * @version 1.0.0
 * @date 2017-06-28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        totalPeople = $('#jTotalPeople'),
        participants = $('#jParticipants'),
        progressBar;

    progressBar = {
        init: function(){},

        exec: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                total,
                member,
                percentage,
                noparticipat,
                promotion = data.data.promotion;

            total = parseInt(promotion.groupNum.groupTargetNum);
            member = parseInt(promotion.groupNum.groupJoinedNum);
            noparticipat = parseInt(total- member);
            percentage = member/total;
            participants.text(noparticipat+'人');
            totalPeople.text(promotion.groupNum.groupTargetNum);
            $('.process').animate({width: percentage*100+"%"},1000);
            $('#jDeadline i').animate({left: (percentage-0.04)*100+"%"},1000);
        }
    };
    module.exports = progressBar;
});
