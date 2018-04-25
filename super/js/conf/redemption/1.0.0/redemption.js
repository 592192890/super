/**
 * @file redemption.js
 * @synopsis  模块名称
 * @author liuhui, 1026527082@qq.com
 * @version 1.0.0
 * @date 2017-06-23
 * modify by  XX
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('lib/core/1.0.0/io/request');
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var ChangeNum = require('common/change-num/1.0.0/change-num');
    var box = require('common/box/2.0.0/js/box');
    var SelectScroll = require('common/select-scroll/1.0.0/select-scroll');
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    var redemptionUrl = context.getConf('url.redemptionUrl');
    var submitUrl = context.getConf('url.submit');
    var cartUrl = context.getConf('url.cart');
    var orderUrl = context.getConf('url.order');
    var invUrl = context.getConf('url.inv');

    require('module/item/1.0.0/details/details');
    // tab --------
    var Tab = require('common/tab/2.0.0/tab');
    var tb = new Tab('.jWrap', {
        loaded: function(obj) {
            // loadData(obj.$ctn);
        }
    });
    tb.on('tabClick', function(obj) {
        // loadData(obj.$ctn);
    });

    var redemption = {
        init: function() {
            this.tabChange();
            this.initialization();
            this.coupon();
            this.store();
        },
        //标签页切换
        tabChange: function() {
            var tabHandlers = $('#jItemTabHeader>li'),
                tabContents = $('#jItemTabWrap>.item-tab-content');
            var showTab = function(index, back) {
                tabHandlers.removeClass('active').eq(index).addClass('active');
                tabContents.removeClass('active').eq(index).addClass('active');
            };
            tabHandlers.on('click', function() {
                showTab(tabHandlers.index(this));
            });
        },
        // 页面初始化
        initialization: function() {
            var self = this;
            //首页的轮播图大于一张使用轮播插件
            if ($('#slides img').length > 0) {
                new Slider('#slides', {
                    height: $(window).width(),
                    lazyLoad: {
                        attr: 'data-url',
                        loadingClass: 'img-error'
                    },
                    play: {
                        auto: false,
                        interval: 4000,
                        swap: true,
                        pauseOnHover: true,
                        restartDelay: 2500
                    }
                });
            }
            // 数量增减
            var changeNum = new ChangeNum('.jChangeNum');
            changeNum.on('limit', function(obj) {
            }).on('update', function(obj) {
                self.num = $('.jQtyTxt').attr('data-cache');
            }).on('delete', function(obj) {
            });

            var jUpdown = $('.jUpdown');
            jUpdown.click(function() {
                if (jUpdown.is(":checked")) {
                    $('.jDescript').removeClass('up');
                    $('.jIcon').addClass('icon-rotate');
                    $('.jIcon').removeClass('arrow-rotate');
                } else {
                    $('.jDescript').addClass('up');
                    $('.jIcon').addClass('arrow-rotate');
                    $('.jIcon').removeClass('icon-rotate');
                }
            });

            if ($('.all-icon').length<0) {
                $('.jIcon').hide();
            }else{
                $('.jIcon').show();
            }

            $('input[name="spec"],input[name="spec2"]').click(function() {
                var listData = $(this).parent().attr('data-list');
                if ($(this).attr("checked")) {
                    $('.jSpec' + listData).addClass('choose');
                    $('.jSpec' + listData).siblings().removeClass('choose');
                }
            });

        },
        textid: "",
        dataValue: "",
        text: "",
        num: "1",
        storeId: "",
        coupon: function() {
            var self = this;
            var tmp = '';
            if ($("#jIntegrate").length > 0) {
                var tmp = $("#jIntegrate").html(); // 模板获取
                $('#jIntegrate').remove();
            }
            if ($('#jGiftType').val() == "YHQ") { 
                $('.jChange').addClass('jBottom');
                $('.jChange').attr('id', '');
                $('.jBottom').removeClass('jChange');  
                // 弹框
                $('.jBottom').click(function() {
                    self.storeId = $('.jStoreAddr').attr('data-storeId');
                    if (self.storeId == '') {
                        //提示
                        box.tips('请先选择门店').on('hidden', function() {});
                    } else{
                        box.bottom(tmp).on('shown', function() {});
                    }
                });
            } else {
                $('.change-now').attr('id', 'jClick');
            }
            $('body').on('click', '#jChangeNow', function() {
                var storeId = $('.jStoreAddr').attr('data-storeId');
                var self = this;
                self.dataValue = $('.jStoreAddr').attr('data-value');
                $(self).attr('disabled', true);
                io.post(submitUrl, {
                        gift_id: self.dataValue,
                        store_id: storeId
                    },
                    function(res) {
                        box.ok('兑换成功！');
                        setTimeout(function() {
                            window.location.href = orderUrl;
                        }, 2000);
                    },
                    function(err) {
                        err.msg && box.error(err.msg); // 失败回调
                        $(self).removeAttr('disabled');
                    });
            });
        },
        store: function() {
            var self = this;
            self.dataValue = $('.jStoreAddr').attr('data-value');
            require(['common/select-scroll/1.0.0/select-scroll',
            'css!common/select-scroll/1.0.0/css/select-scroll.css',
            'jquery'
            ], function(
                SelectScroll, _, $)
            {
                var ss = new SelectScroll({
                    url: redemptionUrl,
                    row: 5, //show number (3|5|7|...) ,must be odd number;
                    column: 2,
                    titles: ['请选择地区', '请选择门店'],
                    ajaxData: {
                        giftId: self.dataValue
                    }
                });
                ss.on('ok', function(obj) {
                    self.textid = obj.data[1].textId;
                    self.text = obj.data[1].text;
                    self.storeId = self.textid;
                    $('.jStoreAddr span').html(self.text);
                    $('.jStoreAddr').attr('data-storeid', self.storeId);
                    //获取库存
                    io.jsonp(invUrl, {
                            gift_id: self.dataValue,
                            store_id: self.storeId
                        },
                        function(res) {
                            var minNum = res.data.num;
                            $('.jStoreAddr').attr('data-num', minNum);
                            if (minNum<=0) {
                                $('.change-now').attr('disabled', true);
                                $('.change-now').html('已抢完');
                            }else{
                                $('.change-now').removeAttr('disabled');
                                $('.change-now').html('立即兑换');
                            }
                        });
                });
                //
                $('#jClick').click(function() {
                    ss.show();
                });
            });
            if ($('.jChangeNum').length <= 0) {
                self.num = null;
            };
            $('.jChange').click(function() {

                self.storeId = $('.jStoreAddr').attr('data-storeId');
                if (self.storeId == '') {
                    //提示
                    box.tips('请先选择门店').on('hidden', function() {});
                } else {
                    window.location.href = cartUrl + '?' + 'gift_id=' + self.dataValue + '&store_id=' + self.storeId + '&num=' + self.num;
                }
            });
        }
    };
    redemption.init();
});
