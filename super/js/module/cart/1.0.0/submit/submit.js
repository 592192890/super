/**
 * @file submit.js
 * @synopsis  购物车
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-22
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        Emitter = require('lib/core/1.0.0/event/emitter'),
        box = require('common/box/1.0.0/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        submitTpl = require('text!./submit.tpl'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        com = require('module/cart/1.0.0/common/common'),
        io = require('lib/core/1.0.0/io/request'),
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'),
        orderPageUrl = "https:"+ context.getConf('url.orderPage'),
        submit,
        isNationwideProIds = [],     //全国配送产品
        isLocalProIds = [],          //本地配送产品
        isSelfProIds = [];           //自提产品

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function isMiniProgram(){
        if(navigator.userAgent.toLowerCase().indexOf('miniprogram')!=-1){
            return true
        }else{
            return false
        }
    }

    submit = {
        events: function() {
            var self = this;
            $('#jChkAll').click(function() {
                var $this = $(this);
                self.emit('checkAll', {
                    $children: $('.jChkItem,.jChkShop'),
                    $this: $this
                });
            });
            //删除商品
            $('#jDelete').click(function() {
                var $this = $(this);
                self.emit('deleteProducts', {
                    $this: $this
                });
            });
            //加入收藏
            $('#jFavorites').click(function() {
                var $this = $(this);
                self.emit('favoritesProducts', {
                    $this: $this
                });
            });
            //清空购物车
            $('#jDeleteAll').click(function() {
                var $this = $(this);
                self.emit('emptyCart', {
                    $this: $this
                });
            });
            //去结算
            var isNavigateTo = false;
            $('#jSubmit').click(function() {
                var isH5 = document.referrer.indexOf('wx.yunhou.com') != -1;
                if(isNavigateTo){
                    return false;
                }
                //未登录状态
                if (!cookie('_nick')) {
                    var url = "https:"+context.getConf('url.login') + '?returnUrl=' + encodeURIComponent(context.getConf('url.page'))
                    if(window.__wxjs_environment === 'miniprogram'|| isMiniProgram()){
                        wx.miniProgram.navigateTo({url: '/pages/web/web?url='+url})
                        return
                    }
                    location.href = url;
                    return false;
                }
                if (com._data._checkedProducts.length == 0) {
                    box.tips('请至少选择一个商品!');
                    return false;
                }
                // 检查购物车配送方式
                io.jsonp('//wx.yunhou.com/super/cart/checkDelivery', function(data) {
                    // data.data.kindTotal = 2;
                    if(data.data.kindTotal == 1) {
                        if((window.__wxjs_environment === 'miniprogram'|| isMiniProgram()) && !isH5){
                            wx.ready(function(){
                                wx.miniProgram.navigateTo({
                                    url: '/pages/web/web?url='+orderPageUrl,
                                    fail: function(res){
                                        wx.miniProgram.navigateTo({
                                            url: '/pages/web/web?url='+orderPageUrl,
                                            fail: function(res){
                                                window.location.href = orderPageUrl;
                                            },
                                            complete: function(res){
                                                isNavigateTo = true;
                                            }
                                        });
                                    },
                                    complete: function(res){
                                        isNavigateTo = true;
                                    }
                                })
                            });
                            
                        }else{
                            window.location.href = orderPageUrl;
                        }
                    }
                    if(data.data.kindTotal > 1) {
                        var list = data.data.list;
                        for(var i = 0;i < list.length; i++) {
                            // ONLY_NATIONWIDE 全国配送;
                            // ONLY_LOCAL 本地配送;
                            // ONLY_SLEF 自提;
                            if(list[i].cartTransportType == "ONLY_NATIONWIDE") {
                                isNationwideProIds = list[i].productIds;
                            }
                            if(list[i].cartTransportType == "ONLY_LOCAL") {
                                isLocalProIds = list[i].productIds;
                            }
                            if(list[i].cartTransportType == "ONLY_SLEF") {
                                isSelfProIds = list[i].productIds;
                            }
                        }
                        var tpl = [
                            '<div class="cart-split-box" style="width:'+ $(window).width() * 0.7 +'px;">',
                                '<div class="hd">请分开结算以下商品</div>',
                                '<div class="bd">',
                                    '<div class="row">',
                                        '<span class="row-lf">',
                                            '<input type="radio" name="splitbox" data-islocal="1" data-total="'+ isLocalProIds.length +'" id="isLocal">',
                                            '<label for="isLocal">门店1小时配送</label>',
                                        '</span>',
                                        '<span class="row-rg">'+ isLocalProIds.length +'件</span>',
                                    '</div>',
                                    '<div class="row">',
                                        '<span class="row-lf">',
                                            '<input type="radio" name="splitbox" data-islocal="0" data-total="'+ isNationwideProIds.length +'" id="fullArea">',
                                            '<label for="fullArea">全国发货</label>',
                                        '</span>',
                                        '<span class="row-rg">'+ isNationwideProIds.length +'件</span>',
                                    '</div>',
                                    '<div class="row">',
                                        '<span class="row-lf">',
                                            '<input type="radio" name="splitbox" data-islocal="0" data-total="'+ isSelfProIds.length +'" id="selfZt">',
                                            '<label for="selfZt">自提</label>',
                                        '</span>',
                                        '<span class="row-rg">'+ isSelfProIds.length +'件</span>',
                                    '</div>',
                                '</div>',
                                '<div class="ft">',
                                    '<span class="btn" action-type="cancel">返回购物车</span>',
                                    '<span class="btn ok disable" id="ok">确认</span>',
                                '</div>',
                            '</div>'
                        ];
                        var b = box.create(tpl.join(''),{
                                modal: true
                            }
                        );
                        b.show();
                        var $ok = $("#ok");
                        //门店1小时配送
                        $("#isLocal").on("click", function () {
                            self.emit('checkProIds', isLocalProIds, 'ONLY_LOCAL');
                            $ok.removeClass('disable');
                        });
                        //全国发货
                        $("#fullArea").on("click", function () {
                            self.emit('checkProIds', isNationwideProIds, 'ONLY_NATIONWIDE');
                            $ok.removeClass('disable');
                        });
                        //自提
                        $("#selfZt").on("click", function () {
                            self.emit('checkProIds', isSelfProIds, 'ONLY_SLEF');
                            $ok.removeClass('disable');
                        });
                        //确认
                        $ok.on("click",function () {
                            var total = $("input[type='radio']:checked").attr("data-total");
                            if(total && total > 0){
                                b.hide();
                                if(window.__wxjs_environment === 'miniprogram'|| isMiniProgram()){
                                    wx.miniProgram.navigateTo({url: '/pages/web/web?url='+orderPageUrl})
                                    return
                                }
                                window.location.href = orderPageUrl;
                            }
                        });
                    }
                }, function(e) {
                    e.msg && box.error(e.msg);
                }, this);
                //window.location.href = context.getConf('url.orderPage');
            });
        },
        //切换操作按钮状态
        toggle: function() {
            $('#jOperBtn').toggleClass('mod-toggle-selected');
        },
        getHtml: function(data) {
					var selectedClass = $('#jOperBtn').hasClass('mod-toggle-selected')?'mod-toggle-selected':'';
					$.extend(data, {_selectedClass: selectedClass});
					return renderTmpl(submitTpl, data);;
        }
    };
    Emitter.applyTo(submit);
    module.exports = submit;
});
