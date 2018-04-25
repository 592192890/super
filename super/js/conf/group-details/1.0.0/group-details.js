/**
 * @file group-details.js
 * @synopsis  团购详情页
 * @author yanghaitao, 178224406@qq.com
 * @date 2017-04-05
 * @modify zhouwei 1097009033@qq.com
 * @modify-date 2017-04-14 16:11:13
 * @version 1.0.0
*/

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        payBtn = require('module/group-details/1.0.0/itemPayBtn/itemPayBtn'),
        progressBar = require('module/group-details/1.0.0/participants/participants'),
        selectQty = require('module/item/1.0.0/select-qty/select-qty'),
        itemPrice = require('module/group-details/1.0.0/price/item-price'),
        cart = require('module/add-to-cart/1.0.0/addcart'),
        advise = require('module/item/1.0.0/advise/advise');
    /**
     *  基本页面组件
     * 1.滑块
     * 2.产品说明
     * 3.选项卡图片及关于产品详细说明
     */
    require('module/item/1.0.0/slider/slider');
    require('module/item/1.0.0/description/description');
    require('module/item/1.0.0/details/details');

    //pop page for download app;
    require('css!common/h52app/1.0.0/h52app.css');
    require('common/h52app/1.0.0/h52app').init('goodsProductIndex', '{"prdouctid":"' + context.getConf('url.gProductId') + '"}');

    var item = {
        //初始化函数
        init: function() {
            this.bindEvent();
            this.tabChange();
            this.initialization();
        },
        //标签页切换
        tabChange: function(){
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
        //绑定事件
        bindEvent: function(){
            selectQty.event();
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
            io.jsonp(url, item_data, function(data){
                // 选择数量
                selectQty.exec(data);
                // 价格
                itemPrice.exec(data);
                //进度条
                progressBar.exec(data);
                // $('.process').animate({width: progressBar.exec(data).percentage*100+"%"},1000);
                // $('#jDeadline i').animate({left: (progressBar.exec(data).percentage-0.04)*100+"%"},1000);
                // 营销图标区域
                $('#promotion').html(advise.getHtml(data));
                 //底部按钮
                if(data.data.button){

                    $('#jPayAhead').html(payBtn.getHtml(data));  // 按钮渲染

                    payBtn.event();

                    if(data.data.button.click == 'disable'){
                        $("#jPurchase").addClass('disabled');  //  即将开始的按钮状态
                    }

                    //  底部按钮地址的距离
                    $('.mod-process').addClass('bottom');
                }
            },function(e) {
                e.msg && box.tips(e.msg);
            });
        }
    };
    item.init();
});
