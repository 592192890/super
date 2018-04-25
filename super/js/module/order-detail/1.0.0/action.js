/**
 * @file order-details-mod
 * @synopsis  liuwei
 * @author liuwei,541042724@.com
 * @version 1.0.0
 * @date 2017-03-23
 */

define(function(require, exports, module) {
    'use strict';
	var $ = require('jquery'),
    io = require('lib/core/1.0.0/io/request'),
    box = require('lib/ui/box/1.0.1/box'),
	countDown = require('lib/gallery/countdown/1.0.0/countdown');
	var error={
		txt:'订单已失效'
	};
   var action = {
		   _init:function(){
			   var self = this;
				self._timeStart(); 
		   },
		   _timeStart:function(){
				var self = this;
				return new countDown({
					targetTime: $(".JTimeRemaining").attr('data-endTime'),
					timeText : ['',':',':','后取消'],
					container : '.JTimeRemaining',
					isShowTimeText : true,
					isShowArea : true,
					type : {
						'd' : false,
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
			   var self = this;	
				$(".jstatus").html(error.txt);
				$(".wrop").children().hide(300);
				var orderId=$(".wrop").attr("order-id");
				io.jsonp(
					$('#time-out-cancel-url').val(),
					{orderId: orderId},
					function() {
						window.location.reload();
					},
					function (e) {
						box.tips(e.msg);
					}
				);				
			}
	};
	action._init();
    module.exports = action;
});	