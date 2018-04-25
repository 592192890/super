/**
 * @file order-pickup.js
 * @synopsis  订单信息
 * @author huangzhengqian
 * @version 1.0.0
 * @date 2017-10-26
 */

define(function(require, exports, module) {
    'use strict';
    var linkageTab = require('./utils/address-plugin');
    var search = window.location.search;
    var io = require('common/kit/io/request');
    var getParameterByName = require('./utils/getparameter');
    var backUrl = window['$PAGE_DATA']['url']['selectDelivery'];
    var buyType = getParameterByName('buyType',window.location);
    if(window['$PAGE_DATA']['hidetab'] != 1) {
        linkageTab({
            url: '/super/delivery/getTree' + search,
            changeCallBackUrl: backUrl,
            // 存最后一个值的隐藏域的id
            lastValueId: 'f4',
            degree: 3,
            labelTxt: ['城市选择', '区域选择', '门店选择'],
            lastChangeCallBack: function (e) {
                if(buyType == 'normal') {
                    window.location.href = "//wx.yunhou.com/super/html/order/order.html?src=1&v" + Math.random();
                }
                if(buyType == 'direct') {
                    window.location.href = "//wx.yunhou.com/super/html/order/buy-at-once.html?src=1&v" + Math.random();
                }
            }
        });
    }

    $("#storeList li").on("click", function() {
        // $(this).addClass('active').siblings("li").removeClass('active');
        var $this = $(this);
        $("#storeList").find("input").removeAttr('checked');
        $this.find('input').attr('checked',true);


        io.jsonp(backUrl,{
            // action : 'set_def_area',
            // area : $('#'+_self.areaId).val
            deliveryType: 1,
            deliveryId: $this.attr('data-deliveryid'),
            shopId: getParameterByName('shopId',window.location),
            buyType: buyType,
            transportConfigId: $this.attr('data-transportconfigid'),
            selfId: $this.attr('data-selfid')
        },function (data) {
            // console.log(data)
            // window.history.go(-1);
            // window.location.href = "//wx.yunhou.com/super/html/order/buy-at-once.html?v" + Math.random();
            if(buyType == 'normal') {
                window.location.href = "//wx.yunhou.com/super/html/order/order.html?src=1&v" + Math.random();
            }
            if(buyType == 'direct') {
                window.location.href = "//wx.yunhou.com/super/html/order/buy-at-once.html?src=1&v" + Math.random();
            }
        },function(err){

        })
    });
});