/**
 * @file presale.js
 * @synopsis  商品详情页
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-04-05
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box'),
        box2 = require('common/box/2.0.0/js/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        share = require('common/wx/1.0.0/share'),

        //mod
        payBtn = require('module/item/1.0.0/itemPayBtn/itemPayBtn'),
        selectQty = require('module/item/1.0.0/select-qty/select-qty'),
        // advise = require('module/item/1.0.0/advise/advise'),
        promotion = require('module/item/1.0.0/promotion/promotion'),
        promotionBanner = require('module/item/1.0.0/promotion-banner/promotionBanner'),
        itemPrice = require('module/item/1.0.0/price/item-price');


    //pop page for download app;
    require('css!common/h52app/1.0.0/h52app.css');
    require('common/h52app/1.0.0/h52app').init('goodsProductIndex', '{"prdouctid":"' + context.getConf('url.gProductId') + '"}');

    /**
     *  basic page component
     *  1.  slider
     *  2.  product description
     *  3   tab images adbout product detail description
     */
    require('module/item/1.0.0/slider/slider');
    require('module/item/1.0.0/description/description');
    require('module/item/1.0.0/details/details');

    var item = {
        promotionTpl: "",
        init: function() {
            this.bindEvent();
            this.tabChange();
            this.initialization();
            // 返回刷新
            window.onpageshow = function(event) {
                if(event.persisted) {
                    window.location.reload();
                }
            };
        },

        //标签页切换
        tabChange: function() {
            var tabHandlers = $('#jItemTabHeader>a'),
                tabContents = $('#jItemTabWrap>.item-tab-content');
            var showTab = function(index, back) {
                tabHandlers.removeClass('active').eq(index).addClass('active');
                tabContents.removeClass('active').eq(index).addClass('active');
            };
            tabHandlers.on('click', function() {
                showTab(tabHandlers.index(this));
            });
        },

        bindEvent: function() {
            var self = this;
            selectQty.event();

            // weightHelp
            $("#weightHelp").on('click', function() {
                var tpl = [
                    '<div class="weight-help-box">',
                    '<div class="title">购买说明</div>',
                    '<p>该商品为称重散卖商品</p>',
                    '<p>我们会按照商品最大规格扣款，您收到商品实际规格少于最大规格时，我们会在您收到商品后，由系统退还差价给您。</p>',
                    '<div class="btn" action-type="ok">关闭</div>',
                    '</div>'
                ];
                box2.bottom(tpl.join(''));
            });

            $(".page-view").on('click', '#jCheckMore', function() {
                if ($("#jCheckMore").has("i").length) {
                    box2.bottom(self.promotionTpl);
                } else {
                    return false;
                }

            });
        },

        //页面初始化
        initialization: function() {
            var self = this;
            var html;
            var url = context.getConf('url.presale');
            var gProductId = context.getConf('url.gProductId');

            var item_data = {
                'product_id': gProductId
            };


            io.jsonp(url, item_data, function(data) {
                // 选择数量
                selectQty.exec(data);

                // 价格，付款日期区域
                itemPrice.exec(data);

                // 营销图标区域
                // $('#promotion').html(advise.getHtml(data));
                $('.item-info').after(promotionBanner.getHtml(data));
                // 营销底部弹窗区域
                self.promotionTpl = promotion.getHtml(data);
                //底部按钮
                if (data.data.button) {
                    // 第一期普通商品底部按钮置灰
                    $('#jPayAhead').html(payBtn.getHtml(data));
                    //第一期处理情况
                    if (payBtn.storeNotice) { // 到货通知
                        $('#jPayAhead').addClass('disabled');
                        $('.soldout').html('已售完')
                    }

                    if(data.data.button && data.data.button.text=='已售完'){
                        $('#jCartAdd').addClass('disabled')
                    }
                    
                    if (data.data.button.click == 'disable') {
                        $('#jPayAhead').addClass('disabled');
                        /*已下架已结束
                        $('.pay-deposit').addClass('disabled')
                        $('#jCartAdd').addClass('disabled')*/
                    }

                    payBtn.event();

                    // 获取购物车里商品个数
                    cart.getcart();

                    //  底部按钮地址的距离 
                    $('.mod-localtion').addClass('bottom');

                    // 第一期处理情况
                    // if (data.data.button.click == 'addCart' || data.data.button.click == 'buy') {
                    //     $('#jPayAhead').hide();
                    //     $('.mod-localtion').removeClass('bottom');
                    // }

                }

            }, function(e) {
                e.msg && box.error(e.msg);
            });
        }
    };

    item.init();

});