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
	countDown = require('lib/gallery/countdown/1.0.1/countdown');
   //倒计时
   var CountDown = new countDown('.jCountTime',
        {
            pattern: 'hh:mm:ss'
        });
   //         createHtml:function(res){
			// 	var self=this,
			// 	str='<span>剩余</span>';
			// 	str=str+'<div class="inline"'+'>'+'<span class="item jHour">06</span>'+'</div>'+
			// 	'<span>:</span>'+
			// 	'<div class="inline"'+'>'+'<span class="item jMinute">35</span>'+'</div>'+
			// 	'<span>:</span>'+
			// 	'<div class="inline"'+'>'+'<span class="item jSecond">28</span>'+'</div>'+
			// 	'<span>结束</span>';
			// 	$('.jTime').html(str);
			// 	self._timeStart();
			// },
    //        _timeStart:function(){
    //             var self = this;
    //             return new countDown({
    //                 targetTime: $(".jTime").attr('data-endTime'),
    //                 timeText : ['',':',':',''],
    //                 container : '.jTime',
    //                 isShowTimeText : true,
    //                 isShowArea : true,
    //                 type : {
    //                     'd' : false,
    //                     'h' : true,
    //                     'm' : true,
    //                     's' : true,
    //                     'ms' : false
    //                 },
    //                 callback : function() {
    //                     self._timeOver();
    //                 }
    //             });
    //        },
    //         _timeOver:function(){
    //            var self = this; 
    //             // $(".jstatus").html(error.txt);
    //             // $(".wrop").children().hide(300);
    //             // var orderId=$(".wrop").attr("order-id");
    //             // io.jsonp(
    //             //     $('#time-out-cancel-url').val(),
    //             //     {orderId: orderId},
    //             //     function() {
    //             //         window.location.reload();
    //             //     },
    //             //     function (e) {
    //             //         box.tips(e.msg);
    //             //     }
    //             // );              
    //         }

    // };
    // newStyle._init();
    // module.exports = newStyle;
});	