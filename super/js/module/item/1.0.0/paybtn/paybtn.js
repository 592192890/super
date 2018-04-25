/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-03-30
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        countDown = require('lib/gallery/countdown/1.0.0/countdown'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        selfPayBtnTpl = require('text!./self-pay-btn.tpl'),
        box = require('common/box/1.0.0/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        itemNumber = $('#jNumber'),
        payBtn = $("#jPayAhead"),
        gProductId = context.getConf('url.gProductId'),
        pay;

    pay = {

        goToPay: false,  //是否支付 

        countTime: false, //倒计时是否结束

        timeout: null,

        init: function(){
            
        },

        event: function(){
            var self = this;
            payBtn.on('click', function(){
                if(self.goToPay){
                    if(self.countTime){
                        self.overtime();
                        return;
                    }
                    self.buyNow();
                }  
            })
        },
        
        // 倒计时结束
        overtime: function(){
            box.tips('预售已结束！');
            payBtn.addClass('disabled');
            $('#jGoToPay').html('<div class="soldout">预售已结束</div>');
            this.goToPay = false;
        },

        buyNow: function() {
            var _this = $(this);
            var num = itemNumber.val();
            if(num == ''){
                num = 1;
            }
            cart.buyNow(gProductId, num, _this);
        },

        getLocalTime: function(tm) {     
            var tt=new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ") 
            return tt;  
        },

        time: function(currentTime, timeend, timeText) {
            var self = this,
                $countDown = $('#jCountDown');

            if(parseInt(currentTime/1000)>parseInt(timeend/1000)){   
                payBtn.addClass('disabled')
                this.goToPay = false;
                return;
            }

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
                    if(self.coming){
                        window.location.reload()
                    }
                    self.countTime = true;
                }
            });

        },


        startCountDown: function(data){
            var self = this,
                timeText = ['',' : ',' : ',''],
                promotion = data.data.promotion;
            if (promotion) {

                // 定金预售
                if (promotion.groupbuy && promotion.groupbuy.type == 'deposit') {
                    if(promotion.depositParam){             
                        if(data.data.currentTime){
                            if(data.data.currentTime<=promotion.depositParam.depositStartTime){
                                this.coming = true  // 预售即将开始的倒计时
                                this.time(data.data.currentTime, promotion.depositParam.depositStartTime, timeText);
                            }else{
                                this.time(data.data.currentTime, promotion.depositParam.depositEndTime, timeText);
                            }
                        }
                    }
                }

                // 全款预售
                if (promotion.groupbuy && promotion.groupbuy.type == 'prebuy') {
                    if(promotion.price.limitTimeType === 'start'){
                        this.coming = true  // 预售即将开始倒计时
                    }
                    if(data.data.currentTime && promotion.price.limitTimeEnd){
                        self.time(data.data.currentTime, promotion.price.limitTimeEnd, timeText);
                    }
                    if($('.mod-process').length<=0){
                        $('.mod-localtion').addClass('bottom');
                    }
                }       
            }
        },

        data: function(rs){
            var data = $.extend({}, rs),
                obj = {},
                btntext,  //按钮文本
                btnclick, //按钮事件
                button = data.data.button,
                promotion = data.data.promotion,
                self = this;

            if(button){
                btntext = button.text;
                btnclick = button.click;
            }

            if(promotion.type && promotion.groupbuy.type == 'prebuy'){   // 全款预售
                btntext = '立即预定';
            }

            obj['btntext'] = btntext;
            obj['btnclick'] = btnclick;

            if( btntext === '支付定金' || btntext === '立即预定'){
                obj['payfor'] = true;
                this.goToPay = true;
                this.timeout = setTimeout(function(){
                    self.timeout && clearTimeout(self.timeout);
                    self.startCountDown(data);
                },100)
            }else{ 
                if(btntext.indexOf('即将开始')>-1){
                    obj['payfor'] = true;
                }
                // '已抢完', '已参与'
                $('#jPayAhead').addClass('disabled');
                this.timeout = setTimeout(function(){
                    self.timeout && clearTimeout(self.timeout);
                    self.startCountDown(data);
                },100)     
            }

            return obj;
        },

        renderTmpl:function(tpl, data){
            return template.compile(tpl)(data || {});
        },

        getHtml: function(data){
            var self = this;
            return this.renderTmpl(selfPayBtnTpl, self.data(data));
        }
    }

    module.exports = pay;
});

