/**
 * @file cart.js
 * @synopsis  购物车
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-21
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        Channel = require('lib/gallery/channel/1.0.0/channel'), //频道
        channelPromotion = '', //频道内容
        //mod
        com = require('module/cart/1.0.0/common/common'),
        list = require('module/cart/1.0.0/list/list'),
        submit = require('module/cart/1.0.0/submit/submit'),
        $wrap = $('#jCart'),
        $editBtn = $('#jEdit'),
        cart;
    //定义
    Channel.define('cart', ['statistics']);
    channelPromotion = Channel.get('cart');

    function insertBPM() {
        (function(f, c, d, e, g, a, b) {
            a = c.createElement(d);
            b = c.getElementsByTagName(d)[0];
            a.async = 1;
            a.src = e;
            b.parentNode.insertBefore(a, b)
        })(window, document, "script", "//" + (location.protocol == "http:" ? "s1" : "ssl") + ".bbgstatic.com/tracer/bpm.js?v=1.0.5", "bpm");
    }

    cart = {
        init: function() {
            var self = this;
            //渲染页面
            com.ajax(context.getConf('url.get'), {}, function(data) {
                self.loadCartModule(data);
								$editBtn.removeClass('mod-toggle-selected');
                self.setEditStatus(data);
                if (context.getConf('env') != "test") {
                    channelPromotion.fire('statistics', data); //统计
                }
            });
            list.on('refreshCartModule', function(data) {
                self.loadCartModule(data);
                self.setEditStatus(data);
            });
            //点击全选按钮
            submit.on('checkAll', function(obj) {
                list.checkItem(obj);
            });
            //根据产品Id选中
            submit.on('checkProIds', function(proids, type) {
                list.checkItemByIds(proids, type);
            });
            //删除商品
            submit.on('deleteProducts', function(obj) {
                list.deleteProducts(obj);
            });
            //收藏商品
            submit.on('favoritesProducts', function(obj) {
                list.favoritesProducts(obj);
            });
            //清空购物车
            submit.on('emptyCart', function(obj) {
                list.emptyCart(obj);
            });

            //编辑 
            $('.mod-toggle').click(function() {
                $(this).toggleClass('mod-toggle-selected');
                submit.toggle();
            });
        },
        //设置编辑按钮的状态
        setEditStatus: function(data) {
            if (data._checked == undefined || data._checked == 'disabled') {
                $editBtn.attr('disabled', 'disabled');
            } else {
                $editBtn.removeAttr('disabled');
            }
        },
        loadCartModule: function(data) {
            com._data = data || {}; //数据缓存
            com._data._checkedProducts = []; //缓存选中的数据
            var self = this,
                html;
            html = list.getHtml(data) + submit.getHtml(data);
            $wrap.html(html);
            list.init();
            submit.events();
        }
    }
    cart.init();
});
