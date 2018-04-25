/**
 * @file presale.js
 * @synopsis  预售详情页
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-03-07
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        share = require('common/wx/1.0.0/share'),

        //mod
        payBtn = require('module/item/1.0.0/paybtn/paybtn'),
        selectQty = require('module/item/1.0.0/select-qty/select-qty'),
        // advise = require('module/item/1.0.0/advise/advise'),
        promotion = require('module/item/1.0.0/promotion/promotion'),
        promotionBanner = require('module/item/1.0.0/promotion-banner/promotionBanner'),
        price = require('module/item/1.0.0/price/price');

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
            this.shareData();
            this.initialization();
        },

        // 分享
        shareData: function() {
            var shareParams = context.getConf('shareData');
            share({
                'title': shareParams.title || 'title',
                'desc': shareParams.desc || 'desc',
                'imgUrl': shareParams.imgUrl || ''
            })
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
            payBtn.event();
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
                $('#jPriceBox').html(price.getHtml(data));

                // 营销图标区域
                // $('#promotion').html(advise.getHtml(data));

                $('.item-info').after(promotionBanner.getHtml(data));
                // 营销底部弹窗区域
                self.promotionTpl = promotion.getHtml(data);
                // 运费后端埋数据
                //$('#jFreight').html()

                //底部按钮
                if (data.data.button) {
                    $('#jPayAhead').html(payBtn.getHtml(data));
                }

            }, function(e) {
                e.msg && box.error(e.msg);
            });
        }
    };

    item.init();

});