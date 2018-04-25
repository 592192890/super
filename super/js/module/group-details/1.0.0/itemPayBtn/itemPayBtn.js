/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-04-05
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        countDown = require('lib/gallery/countdown/1.0.0/countdown'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        selfPayBtnTpl = require('text!./self-pay-btn.tpl'),
        context = require('lib/gallery/context/1.0.0/context'),
        itemNumber = $('#jNumber'),
        box = require('common/box/1.0.0/box'),
        gProductId = context.getConf('url.gProductId'),
        pay;

    pay = {

        goToPay: false, //是否支付 

        addcart: false, // 是否添加到购物车

        storeNotice: false, // 是否到货通知

        unlogin: false, // 是否登录

        init: function() {

        },

        event: function() {
            var self = this;
            $("#jPurchase").on('click', function(e){
                if (self.btnlimit == 0) {
                    box.tips(self.btntips);
                    return;
                }
                if (self.goToPay) {
                    self.buyNow();
                }
                if (self.countTime) {
                    location.reload()
                } 
            })
        },

        //  加入购物车
        cart: function() {
            var _this = $(this);
            var num = itemNumber.val();
            if (num == '') {
                num = 1;
            }
            cart.addcart(gProductId, num, _this);
        },

        // 立即购买
        buyNow: function() {
            var _this = $(this);
            var num = itemNumber.val();
            if (num == '') {
                num = 1;
            }
            cart.buyNow(gProductId, num, _this);
        },

        time: function(timeend) {
            var self = this,
                timeText = ['', ' : ', ' : ', ''],
                $countDown = $('#jCount');


            if (!timeend) {
                payBtn.addClass('disabled')
                return;
            }
            countDown({
                container: $countDown,
                targetTime: timeend,
                type: {
                    'd': false,
                    'h': true,
                    'm': true,
                    's': true,
                    'ms': false
                },
                labelCtn: 'span',
                timeText: timeText,
                isShowTimeText: true,
                callback: function() {
                    location.reload()     
                }
            });

        },

        startCountDown: function(data) {
            var self = this,
                promotion = data.data.promotion,
                price = promotion && promotion.price;

            if (price) {

                if (price.limitTimeType === 'end') {
                    this.begin = true // 已开始倒计时
                }else{
                    this.begin = false // 即将开始倒计时
                }

                if (price.limitTimeEnd) {
                    this.time(price.limitTimeEnd);
                }

            }
        },

        data: function(rs) {
            var data = $.extend({}, rs),
                obj = {},
                btntext, //按钮文本
                btnclick, //按钮事件
                btnlimit,
                btntips,
                button = data.data.button,
                promotion = data.data.promotion,
                price = promotion && promotion.price,
                self = this;


            if (button) {
                btntext = button.text;
                btnclick = button.click;
                this.btnlimit = button.limitNum;
                this.btntips = button.tips;
            }

            obj['btntext'] = btntext;
            obj['btnclick'] = btnclick;
            obj['payfor'] = true;


            if (btnclick == 'disable' && btntext.indexOf('即将开始')>-1) { //即将开始倒计时
                obj['payfor'] = false;
                this.timeout = setTimeout(function() {
                    self.timeout && clearTimeout(self.timeout);
                    self.startCountDown(data);
                }, 100)
                
            } else if (btnclick == 'storeNotice') { //到货通知


                self.storeNotice = true;

            } else if (btnclick == 'addCart') { //活动结束

                self.addcart = true;

            } else if (btnclick == 'direct') { //我要参团

                obj['payfor'] = false;
                this.goToPay = true;
                $("#jPayAhead").addClass('active');
                this.timeout = setTimeout(function() {
                    self.timeout && clearTimeout(self.timeout);
                    self.startCountDown(data);
                }, 100)
                
            } else if (btnclick == 'loginAddCart') { //未登陆

                self.unlogin = true;

            } else if (btnclick == 'buy') {

                self.addcart = true;
            }
            return obj;
        },

        renderTmpl: function(tpl, data) {
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data) {
            var self = this;
            return this.renderTmpl(selfPayBtnTpl, self.data(data));
        }
    }

    Emitter.apply(pay);
    module.exports = pay;
});