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
        countDown = require('lib/gallery/countdown/1.0.0/countdown'),
        box = require('common/box/2.0.0/js/box'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        bottomBtnTpl = require('text!./bottom-btn.tpl'),
        layer = require('module/join-group/1.0.0/layer/layer'),
        context = require('lib/gallery/context/1.0.0/context'),
        selectQty = require('module/join-group/1.0.0/select-qty/select-qty'),
        gProductId = context.getConf('url.gProductId'),
        pay;

    pay = {

        goToPay: false,  //是否支付 

        addcart: false,  // 是否添加到购物车

        storeNotice: false, // 是否到货通知

        unlogin: false, // 是否登录

        countTime: false, // 限购倒计时是否结束
        
        init: function(data){
            return this.event().getHtml(data); 
        },

        event: function(){
            var self = this;

            $("body").on("click", "#jCartAdd", function(){
                if(self.addcart){
                    box.bottom(layer.tpl).on('shown', function() {
                        selectQty.itemNumber = $("#jNumber");
                    });
                }
                if(self.unlogin){
                    var loginUrl = context.getConf('url.login');
                    window.location = loginUrl + encodeURIComponent(location.href); 
                }
            })


            $("#jPurchase").on('click', function(){
                if(self.countTime){
                    location.reload();
                    return;
                } 
                if(self.goToPay){
                    self.buyNow();  
                }     
            })
            
            $("#jAccounts").on('click', function(){
                if(self.unlogin){
                    var loginUrl = context.getConf('url.login');
                    window.location = loginUrl + encodeURIComponent(location.href);
                    return; 
                }
                var url = context.getConf('url.goToCart');
                window.location = url;  
            })

            return this;
        },

        //  加入购物车
        cart: function() {
            var _this = $(this);
            var num = itemNumber.val();
            if(num == ''){
                num = 1;
            }
            cart.addcart(gProductId, num, _this);
        },

        // 立即购买
        buyNow: function() {
            var _this = $(this);
            var num = itemNumber.val();
            if(num == ''){
                num = 1;
            }
            cart.buyNow(gProductId, num, _this);
        },

        time: function(timeend, timeText) {
            var self = this,
                $countDown = $('#jPurchase b');

            if(!timeend){
                payBtn.addClass('disabled')
                return;
            }

            countDown({
                container : $countDown,
                targetTime : timeend,
                type : {'d':false,'h':true,'m':true,'s':true,'ms':false},
                labelCtn: 'span',
                timeText : timeText,
                isShowTimeText: true,
                callback : function() {
                    self.countTime = true;
                }
            });

        },

        startCountDown: function(data){
            var self = this,
                timeText = ['',' : ',' : ',''],
                promotion = data.data.promotion,
                price = promotion && promotion.price;

            if (price) {

                if(price.limitTimeType === 'end'){
                    this.over = true  // 活动结束倒计时
                }

                if(price.limitTimeType === 'start'){
                    this.begin = true  // 活动即将开始
                }

                if(price.limitTimeEnd){
                    this.time(price.limitTimeEnd, timeText);
                }            
     
            }
        },

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                btntext,  //按钮文本
                btnclick, //按钮事件
                button = data.data.button,
                self = this;


            if(button){
                btntext = button.text;
                btnclick = button.click;
            }
            
            obj['btntext'] = btntext;
            obj['btnclick'] = btnclick;
            obj['payfor'] = true;
            obj['goToAppointment'] = true;

            if (btnclick == 'disable') {  //不可点
                //$("#jCartAdd").addClass('disabled');

            } else if(btnclick == 'storeNotice') {   //到货通知

                self.storeNotice = true
                
            } else if(btnclick == 'addCart') {//添加购物车

                self.addcart = true;

            } else if(btnclick == 'direct') {//买买买

                obj['payfor'] = true;
                obj['goToAppointment'] = true;
                obj['nums'] = '5';
                self.addcart = true;

                this.timeout = setTimeout(function(){
                    self.timeout && clearTimeout(self.timeout);
                    self.startCountDown(data);
                    $("#jAccounts").addClass('active');
                },100) 

            } else if(btnclick == 'loginAddCart') {//未登陆

                self.unlogin = true;

            } else if(btnclick == 'buy') {

                self.addcart = true;

            }


            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(bottomBtnTpl, self.data(data));
        }
    }

    module.exports = pay;
});

