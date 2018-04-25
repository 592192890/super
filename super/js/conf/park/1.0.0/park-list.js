/**
 * @file park-list.js
 * @synopsis  模块名称
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-09-9
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/1.0.0/box'),
        Slider = require('common/slider/3.0.4/slider'),
        radialIndicator = require('radialIndicator'),
        template = require('common/template/1.0.1/template'), //模板
        choosePlate = require('text!./choose-plate.tpl'),
        outDoorUrl = 'http://apis.map.qq.com/tools/poimarker?type=0&referer=myapp',//key:RJWBZ-GXELX-M7V4F-7AASW-OR2TV-JIBS6&referer=myapp
        returnUrl,
        opt;
    
    opt = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            self.slider();
            self.showFees(); //收费标准
            self.showRlus(); //券使用规则
            //self.remainPercent(); //优惠券百分比
            self.goPayment(); //去缴费
            self.goThere(); //室外导航
        },
        slider:function(){
            var slider = new Slider('#jSlides', {
                // width: 750,
                // height: 260,
                lazyLoad:
                {
                    attr: 'data-url',
                    loadingClass: 'img-error'
                },
                play:
                {
                    auto: true,
                    interval: 4000,
                    swap: true,
                    pauseOnHover: true,
                    restartDelay: 2500
                }
            });
        },
        showFees: function () {
            $('.jFeesBtn').click(function () {
                //展示隐藏
                var $jParkFees = $(this).parent('.jParkFees');
                var upArrow = $jParkFees.find('.jFeesBtn')[0],
                    downArrow = $jParkFees.find('.jFeesBtn')[1];
                if ($jParkFees.hasClass('park-fees-up')) {
                    $(upArrow).hide();
                    $(downArrow).show();
                    $jParkFees.removeClass('park-fees-up').addClass('park-fees-down');
                } else {
                    $(upArrow).show();
                    $(downArrow).hide();
                    $jParkFees.removeClass('park-fees-down').addClass('park-fees-up');
                }

            })
        },
        showRlus: function () {
            //下拉展示
            $('body').on('click', '.jShowCouponInfo ', function () {
                var $arrow = $(this).find('.jCouponArrow');
                var $ctn = $(this).closest('.jItemBox').find('.jItemCtn');
                var $section = $(this).closest('.jCouponList');
                var $allCtn = $section.find('.jItemCtn');
                var isVisible = $ctn.is(':visible');
                var $allArrow = $section.find('.jShowCouponInfo').find('.jCouponArrow');
                $allCtn.hide();
                $allArrow.show();
                $arrow[isVisible ? 'show' : 'hide']();
                $ctn[isVisible ? 'hide' : 'show']();
            })
        },
        remainPercent: function () {
            //获取元素的data-percent,有多个就遍历
            $('.jRemainPercent').radialIndicator({
                barColor: '#fb595c',
                barWidth: 10,
                initValue: 100,
                roundCorner: true,
                percentage: true
            });
        },
        goPayment: function () {
            $('.jPayment').click(function (e) {
                var _this = $(this),
                    carNoLi = e.target;
                    
                if(carNoLi.tagName != 'LI'){
                    var data = {};
                    data.isAjax = 1;
                    data.shopId = _this.parents('.park-item').attr('data-shopid');
                    io.get(context.getConf('url.getCars'), data, function (res) {
    
                    }, function (res) {
                        _this.children('.payment-list') && _this.children('.payment-list').remove();
                        
                        if (res.error == 2000) { //一个车牌
                            window.location.href = res.data.url;
                        }
                        if (res.error == -100) { //未登录
                            box.error(res.msg);
                            setTimeout(function() {
                                window.location.href = context.getConf('url.loginUrl') + location.href;
                            }, 1500); 
                        }
                        if (res.error == 1000) { //未绑定车牌
                            box.error(res.msg);
                            setTimeout(function() {
                                window.location.href = res.data.url;
                            }, 1500); 
                        }
                        if (res.error == 3000) { //多个车牌,res.data.length>1
                            box.error(res.msg);
                            _this.append(template.compile(choosePlate)(res))
                            returnUrl = res.url;
                        }
    
                    },this);
                }else{
                    window.location.href = returnUrl + '&carNo=' + $(carNoLi).text();
                }
               
            })
        },
        goThere:function(){
            $('.jGoThere').click(function(){
                var _this = $(this),
                    lat =  _this.attr('data-latitude'),
                    lng =  _this.attr('data-longitude'),
                    position = '&marker=coord:'+lat+','+lng,
                    setShopId = _this.parents('.park-item').attr('data-shopid');
                io.get(context.getConf('url.getSetting'), {shopId:setShopId}, function (res) {
                    if(res.data.setting.key){
                        var key = '&key='+res.data.setting.key;
                        window.location.href = outDoorUrl+position +key;
                    }else{
                        box.error('缺失密钥key');
                    }   
                },function(){
                    box.error(res.msg);
                },this)
            })
        }
    }
    opt.init(); //初始化
});