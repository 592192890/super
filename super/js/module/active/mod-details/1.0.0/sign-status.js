/**
 * @file sign-status.js
 * @synopsis  报名状态
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-11-03
 * @alter liuwei 2017-03-14
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery'),
    io = require('lib/core/1.0.0/io/request'),
	freesTpl = require('text!tpl/active-details/1.0.0/sign-status-free.tpl'),
	paidTpl = require('text!tpl/active-details/1.0.0/sign-status-paid.tpl'),
    template = require('lib/template/3.0/template'),
    activity_id = $('#jactivityId').val(),
    Box = require('lib/ui/box/1.0.1/box'),
	context = require('lib/gallery/context/1.0.0/context');
	
	//按钮状态文字、报名文字状态
    var btnTxt = {
        '-100': {
            'txt': '去报名',
            'classTxt': '',
			'classBtn': 'jNoLogin'
        },
        '-400': {
            'txt': '即将开始',
            'classTxt': '',
			'classBtn': 'continue'
        },
        '-500': {
            'txt': '已结束',
            'classTxt': 'disabled',
			'classBtn': 'complete'
        },
        '-600': {
            'txt': '已报名',
            'classTxt': '',
			'classBtn': 'flag'
        },
        '-700': {
            'txt': '已报满',
            'classTxt': 'disabled',
			'classBtn': 'cover'
        },
		'-900':{
			'txt': '去支付',
            'classTxt': '',
			'classBtn': 'jToPay'
		},
        '0': {
            'txt': '我要报名',
			'classTxt': '',
            'classBtn': 'jSignUp'
        },
        '-default': {
            'txt': '即将开始',
            'classTxt': '',
			'classBtn': 'continue'
        }
    }; 
	
    var signStatus = {
        _init: function() {
            var self = this;
            io.jsonp(context.getConf('url.GetActiveInfo') + activity_id, {}, function(data) {
                self.setStatus(data);
            });
            self._events();
        },
        setStatus: function(data) {
            var self = this;
			switch(data.type){
				case "_paid_": 
					$('#jactivityId').attr("data-type","_paid_");break;
				case "_free_": 
					$('#jactivityId').attr("data-type","_free_");break;
				default:
					$('#jactivityId').attr("data-type","_none_");return;
			}
            if (data && data.data && data.error != '-300') {
                if (data.data.left_num == '_max_') {
                    data.data._left_txt = '不限名额';
                }
                self.updateTmpl(data);
            } else if (data.error == '-100') {
                self._noLogin();
            } else {
                self._rmPadding();
            }
            if (data && data.data && btnTxt[data.error] == undefined && data.error != '-300') {
                Box.tips('系统异常');
            };
            //修改状态
            if (data && data.data) {
                var status = data.data.status;
                if (status && status.length != 0)
                    $('#jStatus').html(status);
            }
        },
        updateTmpl: function(data, code) {
            var self = this;
            var code = code != undefined ? code : data.error;
            var _data = data.data ? data.data : {
                total: 0,
                signup_count: 0,
                left_num: 0 ,
            }
            var html = self.renderTmpl( self.judge(data), {
                data: data.data,
                btnTxt: (btnTxt[code] || btnTxt['-default'])
            });
            $('#jSign').html(html);
        },
        renderTmpl: function(tpl, data) {
            return template.compile(tpl)(data || {});
        },
		judge:function(data){
			return data.type != '_free_' ? paidTpl : freesTpl;
		},
        _noLogin: function() {
            window.location.href = context.getConf('url.Login') + '?returnUrl=' + encodeURIComponent(window.location.href);
        },
        _events: function() {
            var self = this;
            //未登录
            $('#jSign').on('click', '.jNoLogin', function() {
                self._noLogin();
            }).on('click', '.jSignUp', function() {
                // 报名
				var $dom=$(this); //防止重复提交
				if(!$dom.hasClass('jdisabled')){
					$dom.addClass('jdisabled');
				 // 报名
					io.jsonp(context.getConf('url.GetActivePlaces'), {
						activity_id: activity_id
					}, function(data) {
						if (data.error == -900) {
							window.location.reload();
						}
						$dom.removeClass('jdisabled');
					if(!!data.data.redirectUrl){
							window.location.href=data.data.redirectUrl;						
						}else{
							Box.tips(data.msg);
						}
					});
				}
            }).on('click', '.jToPay', function() {
				var $dom=$(this); //防止重复提交
				if(!$dom.hasClass('jdisabled')){
					$dom.addClass('jdisabled');
                // 去支付
					io.jsonp(context.getConf('url.GetActivePlaces'), {
						activity_id: activity_id
					}, function(data) {
						if (data.error == -900) {
							window.location.reload();
						}
						$dom.removeClass('jdisabled');
						if(!!data.data.redirectUrl){
							window.location.href=data.data.redirectUrl;						
						}else{
							Box.tips(data.msg);
						}
					});
				}
            });
        },
        _rmPadding: function() {
			//消掉底部边框
            $('.page-view').addClass("rm-Padding");
        },
		gameOver:function()	{
			//活动时间到了调用方法
            var self = this,
				activity_type = $('#jactivityId').attr('data-type');
            var _data= {
				error : -500,
				msg : "已结束",
				type : activity_type,
				data:{
					total: 0,
					signup_count: 0,
					left_num: 0 ,
					price:0
				} 
            };
			if(activity_type == '_none_' || !activity_type){
				return;
			}
			self.updateTmpl(_data);
		}
    };
    signStatus._init();
    module.exports = signStatus;
});
