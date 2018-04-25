/**
 * @version 1.0.0
 * @date 2016-11-03
 * @alter liuwei 2017-03-14
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery'),
    io = require('lib/core/1.0.0/io/request'),
    activity_id = $('#jactivityId').val(),
    Box = require('lib/ui/box/1.0.1/box'),
	countDown = require('lib/gallery/countdown/1.0.0/countdown'),
	context = require('lib/gallery/context/1.0.0/context'),
	signStatus = require('./sign-status');
	var statusTxt={
		before	:	"未开始",
		now		:	"进行中",
		after	:	"已结束"
	};
    var timeStatus = {
        _init: function() {
            var self = this;
			io.jsonp(context.getConf('url.GetActiveInfo') + activity_id,{} , function (res) {
				if (!!res.time) {
					self._judge(res.time);
				}
			});
        },
		_judge:function(res){
			var self = this;
			if(parseInt(res.now_time) < parseInt(res.start_time)){
				$('.jStatus').html(statusTxt.before);
			}else if(parseInt(res.now_time) > parseInt(res.end_time)){
				$('.jStatus').html(statusTxt.after);
			}else{
				$('.jStatus').html(statusTxt.now);
				self.createHtml(res);
			}
		},
		createHtml:function(res){
			var self=this,
			str='距离报名结束&nbsp;';
			str=str+'<label class="date jCountTime" data-animate="date-animate"'+
				'data-endtime="'+ res.end_time +'" data-starttime="' + res.start_time + '"></label>';
			$('.jTimeContain').html(str);
			self._timeStart();
		},
		_timeAfter:function(){
			$('.jStatus').html(statusTxt.before);
		},
		_timeStart:function(){
			var self = this;
			return  new countDown({
				targetTime: $('.jCountTime').attr('data-endTime'),
				timeText : ['天&nbsp;','时&nbsp;','分&nbsp;','秒'],
				container : '.jCountTime',
				isShowTimeText : true,
				isShowArea : true,
				type : {
					'd' : true,
					'h' : true,
					'm' : true,
					's' : true,
					'ms' : false
				},
				callback : function() {
					self._timeOver();
				}
			});
		},
		_timeOver:function(){
			$('.jStatus').html(statusTxt.after);
			signStatus.gameOver();
		}
    };
    timeStatus._init();
    module.exports = timeStatus;
});
