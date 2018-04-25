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
        cookie = require('common/kit/io/cookie'),
        countDown = require('lib/gallery/countdown/1.0.0/countdown'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        selfPayBtnTpl = require('text!./self-pay-btn.tpl'),
        context = require('lib/gallery/context/1.0.0/context'),
        itemNumber = $('#jNumber'),
        gProductId = context.getConf('url.gProductId'),
        box = require('common/box/1.0.0/box'),
        io = require('lib/core/1.0.0/io/request'),
        pay;

    var d = {
        'source': 'wap'
    };

    var flat = false

    var goAccount = context.getConf('url.goAccount');

    io.jsonp(goAccount, d, function(res) {
        if(res.data&&res.data.totalQuantity==0){
            flat = true
        }
    },function(e){
    });

    pay = {

        goToPay: false, //是否支付 

        addcart: false, // 是否添加到购物车

        storeNotice: false, // 是否到货通知

        unlogin: false, // 是否登录

        countTime: false, // 限购倒计时是否结束

        init: function() {

        },

        event: function() {
            var self = this;
            $("#jCartAdd").on('click', function(e) {
                // if(self.addcart){
                //     self.cart();
                // }
                var className = $(this).attr("class")
                if(className.indexOf('disabled')!=-1){
                    return
                }
                if (self.unlogin && cookie('_nick') === null) {
                    var loginUrl = context.getConf('url.login');
                    window.location = loginUrl + '?returnUrl=' + encodeURIComponent(window.location.href);
                } else {
                    self.cart();
                }
            });
            $("#jPurchase").on('click', function() {
                if (self.countTime) {
                    window.location.reload();
                    return;
                }
                if (self.goToPay) {
                    self.buyNow();
                }
            });
            $("#jAccounts").on('click', function() {
                if (self.unlogin && cookie('_nick') === null) {
                    var loginUrl = context.getConf('url.login');
                    window.location = loginUrl + '?returnUrl=' + encodeURIComponent(window.location.href);
                    return;
                }
                var text = $('#nums').text() || 0;
                if(flat && text<1){
                    box.tips('购物车为空，请添加一件商品')
                    return
                }
                var url = context.getConf('url.goToCart');
                window.location = url;
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
        //秒杀的（旧）
        time: function(timeend, timeText) {
            var self = this,
                $countDown = $('#jCount');

            if (!timeend) {
                payBtn.addClass('disabled')
                return;
            }

            countDown({
                container: $countDown,
                targetTime: timeend,
                type: { 'd': false, 'h': true, 'm': true, 's': true, 'ms': false },
                labelCtn: 'span',
                timeText: timeText,
                isShowTimeText: true,
                callback: function() {
                    self.countTime = true;
                }
            });

        },
        //限时促销的（对接新营销平台）
        timeNew: function(timeend, timeText) {
            var self = this,
                $countDown = $('#jCount');
            countDown({
                container: $countDown,
                targetTime: timeend,
                type: { 'd': false, 'h': true, 'm': true, 's': true, 'ms': false },
                // labelCtn: 'span',
                timeText: timeText,
                isShowTimeText: true,
                callback: function() {
                    self.countTime = true;
                    window.location.reload();
                }
            });

        },

        startCountDown: function(data) {
            var self = this,
                timeText = ['', ' : ', ' : ', ''],
                promotion = data.data.promotion,
                price = promotion && promotion.price;

            if (price) {

                if (price.limitTimeType === 'end') {
                    this.begin = true // 已开始
                }

                if (price.limitTimeEnd) {
                    this.time(price.limitTimeEnd, timeText);
                }

            }
        },
        data: function(rs) {
            var data = $.extend({}, rs),
                obj = {},
                btntext, //按钮文本
                btnclick, //按钮事件
                button = data.data.button,
                list = data.data.promotion.list,
                timeText = ['', ' : ', ' : ', ''],
                self = this;

            //判断该商品是否有限时促销活动，及倒计时数据
            if (list) {
                for (var index = 0; index < list.length; index++) {
                    if (list[index].type == "UMP_GOODS_FIXED" && list[index].endTime) {
                        obj['count'] = true;
                        var endTime = list[index].endTime;
                        self.timeout = setTimeout(function() {
                            self.timeout && clearTimeout(self.timeout);
                            self.timeNew(endTime, timeText);
                            $("#jCartAdd .text-block").addClass("half-line-height")
                        }, 100)
                    }
                }
            }


            if (button) {
                btntext = button.text;
                btnclick = button.click;
            }

            obj['btntext'] = btntext;
            obj['btnclick'] = btnclick;
            obj['payfor'] = true;
            if (btnclick == 'disable') { //不可点
                $("#jCartAdd").addClass('disabled');

            } else if (btnclick == 'storeNotice') { //到货通知

                self.storeNotice = true

            } else if (btnclick == 'addCart') { //添加购物车

                self.addcart = true;

            } else if (btnclick == 'direct') { //买买买

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

    module.exports = pay;
});