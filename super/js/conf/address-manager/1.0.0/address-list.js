/**
 * 个人中心 - 地址列表页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload/lazyload');
    var context = require('lib/gallery/context/1.0.0/context');
    var cookie = require('common/kit/io/cookie');

    //空数据时候输出到页面上的dom
    var domStr = '<section class="my-center-none" >' +
        '<div class="bd"><i class="iconfont">&#xe601;</i></div>' +
        '<div class="ft">您还没有添加收货地址</div>' +
        '</section>';

    var type = {
        normal: 'order',
        direct: 'buy-at-once'
    }
	
	//微信web-view a标签有概率跳转不过
	$(".address_btn_bot").on("tap",".ui-btn-block",function(e){
		e.preventDefault();
		window.location.href=$(this).attr("href");
	});
	
    // 按钮初始化
    var clickHandles = {
        defaultBtn: function(e) {
            e.preventDefault();
            var $this = $(this);
            var sender = this;
            var url = context.getConf('url.addressSetDef');
            var $jAddressClick = $this.parents(".address-item").children(".jAddressClick");
            var addrId = $this.attr('data-id');
            io.get(url, {
                addrId: addrId,
                longitude: $jAddressClick.attr('data-longitude'),
                latitude: $jAddressClick.attr('data-latitude'),
                buyType: getUrlValue('source'),
                transportType: getUrlValue('transportType')
            }, function(e) {
                if (e.error == '0') {
                    $this.parents(".mod-address-list").children(".default").removeClass("default");
                    var $dom = $this.parents(".address-item").toggleClass("default");
                    Dialog.tips(e.msg || '设置默认地址成功');
                    if (source == 'normal' || source == 'direct') {
                        var date = {
                            addrId: addrId,
                            buyType: ''
                        };
                        io.jsonp(context.getConf('url.selectAddr'), date, function() {
                            window.location.href = context.getConf('url.order') + type[source] + '.html';
                        }, function(e) {
                            Dialog.tips(e.msg);
                        })
                    }
                    if(source == 'invoice'){
                        window.location.href = context.getConf('url.invoice');
                    }
                    
                } else {
                    Dialog.tips(e.msg || '设置默认地址失败，请稍后重试');
                }

            }, function(e) {
                Dialog.tips(e.msg || '设置默认地址失败，请稍后重试');
            }, sender);
            // Dialog.tips('设置默认地址失败');
        },
        deleteBtn: function(e) {
            e.preventDefault();
            var dlgTmpl = "确定要删除该收货地址吗？";
            var $this = $(this);
            var sender = this;
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: dlgTmpl,
                btn: [{
                    value: '取消',
                    isHide: true,
                    callBack: function() {}
                }, {
                    value: '确定',
                    isHide: true,
                    callBack: function() {
                        var url = context.getConf('url.addressDel') + '?addrId=' + $this.attr("data-id");
                        io.get(url, {}, function(e) {
                            if (e.error == '0') {
                                Dialog.tips(e.msg || '删除地址成功');
                                //添加cookie  判断是小票列表删除之后的返回
                                cookie.set('isDelateBack', '1');
                                window.location.reload();
                            } else {
                                Dialog.tips(e.msg || '删除地址失败，请稍后重试');
                            }
                        }, function(e) {
                            Dialog.tips(e.msg || '删除地址失败，请稍后重试');
                        }, sender);
                    }
                }]
            });
        }
    }
    for (var k in clickHandles) {
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-address-list").on("click", key, handle);
        }
    }

    //获取url参数值
    var getUrlValue = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    //跳转到结算页
    var jBody = $('.jAddressClick'),
        source = getUrlValue('source');
    if (source == 'normal' || source == 'direct' || source == 'points'|| source == 'invoice') {
        jBody.addClass('bd-hover');
        jBody.on('click', function() {
            var date = {
                addrId: $(this).attr('data-id'),
                // buyType: $(this).attr('data-buy-type'),
                buyType: getUrlValue('source'),
                transportType: getUrlValue('transportType'),
                longitude: $(this).attr('data-longitude'),
                latitude: $(this).attr('data-latitude')
            };
            io.jsonp(context.getConf('url.selectAddr'), date, function(result) {
                //add by Andrew
                if(result.error != '0') {
                    Dialog.tips(result.msg);
                    return;
                }
                if(source == 'points'){
                    window.location.href = context.getConf('url.order');
                }else if(source == 'invoice'){
                    window.location.replace(context.getConf('url.invoice'));
                }else{
                    window.location.href = context.getConf('url.order') + type[source] + '.html';
                }
            }, function(e) {
                Dialog.tips(e.msg);
            });
        });
    }

    $('.ui-btn-primary-line').click(function(){
        if($('.mod-address-list .address-item').length == 10){
            Dialog.tips('最多添加10条收货地址！');
            return false;
        }
    });

    (function(){
        if($('.mod-address-list .address-item').length == 10){
            $('.ui-btn-primary-line').hide();
        }
    })();
});
