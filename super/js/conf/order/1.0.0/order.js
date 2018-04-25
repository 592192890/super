/**
 * @file order.js
 * @synopsis  结算
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-08
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        Emitter = require('lib/core/1.0.0/event/emitter'),
        Channel = require('lib/gallery/channel/1.0.0/channel'), //频道
        channelPromotion = '', //频道内容
        //mod
        com = require('module/order/1.0.0/common/common'),
        address = require('module/order/1.0.0/address/address'),
        invoice = require('module/order/1.0.0/invoice/invoice'),
        total = require('module/order/1.0.0/total/total'),
        submit = require('module/order/1.0.0/submit/submit'),
        list = require('module/order/1.0.0/list/list'),
        $wrap = $('#jOrder'),
        order;

    //定义
    Channel.define('order', ['statistics']);
    channelPromotion = Channel.get('order');
    //判断对象是否为空

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    order = {
        init: function() {
            var self = this;
            var isRefresh = (getUrlParam('isRefresh') == 1);
            var url = context.getConf('url.' + (isRefresh ? 'getRefresh' : 'getSettlementList'));
            //跳转登录
            if (!cookie('_nick')) {
                location.href = context.getConf('url.login') + '?returnUrl=' + encodeURIComponent(context.getConf('url.page'));
                return false;
            }
            // 渲染模板
            com.ajax(url, {}, function(data) {
                //show download page
                if (data && data.data) {
                    // 超市业态到店自提去掉顶部app链接
                    // if( data.data.transportType == 'ONLY_LOCAL'|| data.data.transportType == 'LOCAL_SLEF'){
                    //     require('css!common/h52app/1.0.0/h52app.css');
                    //     var h52app = require('common/h52app/1.0.0/h52app');
                    //     h52app.showTopPop();
                    // }
                }
                self.loadOrderModule(data);
            });
            //提交
            submit.on('submit', function() {
                //hidinvoice字段为1,不需要验证发票
                if($('#jSubmit').attr('data-hidinvoice')==1){
                    if (address.validate() && list.validate()) {
                        invoice.saveInvoice();
                    };
                }else{
                    if (address.validate() && invoice.validate() && list.validate()) {
                        invoice.saveInvoice();
                    };
                }
                
            });
            //发票保存成功
            invoice.on('saveInvoice', function() {
                submit.subOrder(list.getData());
            });
            //保存自提点
            address.on('saveSelfMetion', function(data) {
                self.loadOrderModule(data);
            })
        },
        loadOrderModule: function(data) {
            var self = this;
            var html = '';
            //增加hidinvoice字段判断
            if(data.data.hidinvoice==1){
                html = address.getHtml(data) + /*invoice.getHtml(data) +*/ list.getHtml(data) + total.getHtml(data) + submit.getHtml(data);
            }else{
                html = address.getHtml(data) + invoice.getHtml(data) + list.getHtml(data) + total.getHtml(data) + submit.getHtml(data);
            }
            
            $wrap.html(html);
            address.events();
            invoice.events();
            submit.events();
            list.init();
            if (context.getConf('env') != "test") {
                channelPromotion.fire('statistics', data.data); //统计
            }
        }
    };
    order.init();
    module.exports = {};
});
