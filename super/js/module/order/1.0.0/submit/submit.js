/**
 * @file submit.js
 * @synopsis  提交
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-09
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'), //引入小程序对象
        Emitter = require('lib/core/1.0.0/event/emitter'),
        box = require('lib/ui/box/1.0.1/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        preSaleTpl = require('text!./pre-sale.tpl'),
        submitTpl = require('text!./submit.tpl'),
        com = require('module/order/1.0.0/common/common'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        submit;
    //引入小程序对象
    //require('common/base/jweixin/1.0.0/jweixin-1.3.2.js')

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }


    /* --------------------------------------------------------------------------*/
    /**
     * @synopsis  parseBrowserArg 转换浏览器参数
     *
     * @param obj [object] {key:value}
     *
     * @returns [string] { key=value&key2=value2}
     */
    /* ----------------------------------------------------------------------------*/
    function parseBrowserArg(obj) {
        var ar = [];
        $.each(obj, function(k, v) {
            ar.push(k + '=' + v);
        });
        return ar.join('&');
    }

    submit = {
        data: function(data) {
            if (data.data._isPreSale) {
                data.data._submitTpl = renderTmpl(preSaleTpl, data);
                $('body').removeClass('mod-body-140');
            } else {
                $('body').addClass('mod-body-140');
            }
            return data.data;
        },
        subOrder: function(_opt) {
            var $btn = $('#jSubmit'),
                opt = {};

            // 到店自提隐藏域验证
            var $ztdom = $(".order-selfzt");
            for(var i = 0,ztlength = $ztdom.length;i< ztlength; i++) {
                if(!$ztdom.eq(i).val()) {
                    box.error('未选择自提门店!');
                    return false;
                }
            }
            // 如果页面存在$ztdom隐藏域并且值为空，弹出错误验证
            // if(ztlength && ztbool) {
            //     box.error('未选择自提门店!');
            //     return false;
            // }

            //获取自提时间数据
            var timeEls = $("input[data-zttime]");
            var deliverytype = $(".ui-tab .active").attr("data-deliverytype");
            var zttime = {};
            for(var t=0,l = timeEls.length; t< l; t++) {
                var _timeEl = $(timeEls[t]);
                if(!_timeEl.val()) {
                    deliverytype == 1 ? box.error('未选择自提时间!') : box.error('未选择配送时间!');
                    return false;
                }
                zttime[_timeEl.parents(".shop-wrap").attr("data-shopid")] = _timeEl.val()
            }
            if(Object.keys(zttime).length) {
                _opt.customShopIdShipTimes = JSON.stringify(zttime);
            }
            $btn.addClass('disabled');
            // if(window.__wxjs_environment === 'miniprogram'){
            //     opt.source = 'miniprogram'
            //     $.extend(_opt, opt)
            // }
            com.ajax(context.getConf('url.subOrder'), (_opt || {}), function(data) {
                if (data && data.data) {
                    // opt = {
                    // sign: data.data.jSign,
                    // token: data.data.tradePayToken,
                    // showwxpaytitle: 1
                    // };
                    // location.href = context.getConf('url.payAddr') + "?" + parseBrowserArg(opt);
                    wx.miniProgram.getEnv(function(res) {
                        if(res.miniprogram){
                            wx.miniProgram.reLaunch({url: '/pages/homepage/homepage?title=线上商城&appSource=h5&source=forPay&merOrderNo='+data.data.phpPayToken.payCode+'&payOrderNo='+data.data.phpPayToken.payOrderNo+'&orderAmt='+data.data.phpPayToken.payAmount})
                            return
                        }
                    })
                    if(data.data.action){
                        location.href = data.data.action;
                    }     
                }
                $btn.removeClass('disabled');
            }, function(data) {
                $btn.removeClass('disabled');
            });
        },
        events: function() {
            var $btn = $('#jSubmit'),
                self = this;
            $btn.click(function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var sTag = $(this).attr('data-s-tag'),
                    tips = $(this).attr('data-tips');
                if (sTag != undefined && sTag != 0) {
                    box.error(tips);
                } else {
                    submit.emit('submit');
                }
            });
            $('#jAgree').click(function() {
                $btn[$(this).prop('checked') ? 'removeClass' : 'addClass']('disabled');
            });
        },
        getHtml: function(data) {
            return renderTmpl(submitTpl, this.data(data));
        }
    }
    Emitter.applyTo(submit);
    module.exports = submit;
});
