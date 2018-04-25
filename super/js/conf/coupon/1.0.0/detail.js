/**
 * @file detail.js
 * @synopsis  coupon detail
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-05-25
 * @modify leaytam
 * @date 2017-5-31
 * @function add carNumber url
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var io = require('lib/core/1.0.0/io/request');
    var box = require('common/box/2.0.0/js/box');
    var cookie = require('common/kit/io/cookie');
    var BBGMobile = require('mobileapi');
    // var browser = require('common/browser/1.0.0/browser');
    require('css!common/box/2.0.0/box.css');

    //show app share
    // if (browser.isInsideAPP()) {
    //     BBGMobile.call("view.share.show");
    // }
    //shop -----------
    var $shop = $('#jShop');
    var $ul = $shop.find('ul');
    var len = $ul.find('li').length;

    function setHight(flag) {
        var htmlFontSize = $('html').css('font-size').replace('px', '');
        var height = 1.06667 * (flag ? 1 : len);
        $ul.height(height * htmlFontSize);
    }
    $shop.click(function() {
        $(this).toggleClass('selected');
        setHight(!$(this).hasClass('selected'));
    });

    //绑定车牌 or 选择车牌 ----------
    var obj = {};
    var bindCarNoPage = context.getConf('url.bindCarNoPage') + cookie.get('channel');
    obj.couponType = context.getConf('couponType');
    obj.goodsid = context.getConf('goodsid');

    function labelToggle() {
        $('.jCarLabel').click(function() {
            $(this).addClass('checked').siblings().removeClass('checked');
        });
    }

    function getCarNo(callback) {
        function getList(list) {
            var ar = [];
            $.each(list, function(i, v) {
                var checked = (i == 0 ? 'checked' : '');
                var checkedStr = (i == 0 ? 'checked' : '')
                ar.push('<label class="tap-lt jCarLabel ' + checkedStr + '"><span>' + v.name + '</span><span><input type="radio" name="jRadios" ' + checked + '  data-value="' + v.name + '"/></span></label>');
            });
            return ar.join('');
        }
        io.jsonp(context.getConf('url.plateList'), obj, function(data) {
            if (data && data.data != undefined) {
                if (data.data.length == 0 || !data.data) {
                    location.href = bindCarNoPage;
                } else {
                    var str = getList(data.data);
                    box.confirm(str, {
                        hideClose: false,
                        className: 'ui-pop mod-plate-list',
                        title: '请选择车牌',
                        cancelValue: '去管理车牌',
                        okValue: '确定'
                    }).action({
                        cancel: function() {
                            location.href = bindCarNoPage;
                        },
                        ok: function(e) {
                            var $el = $('[name=jRadios]:checked');
                            obj.car_no = $el.attr('data-value');
                            if (obj.car_no != undefined) {
                                callback && callback();
                            } else {
                                location.href = bindCarNoPage;
                            }
                        }
                    }).on('shown', function() {
                        labelToggle();
                    });
                }
            }
        }, function(data) {
            box.tips(data.msg);
            if (data.error == 300) {
                //没有车牌号跳转到车牌绑定页面
                setTimeout(function() {
                    location.href = bindCarNoPage;
                }, 2000);
            }

            if (data.error == -100) {
                setTimeout(function() {
                    location.href = context.getConf('url.login') + '?returnUrl=' + location.href;
                }, 2000);
            }
        });
    }

    // receive Coupon ----------------------------
    function receiveCoupon() {
        var freeType = context.getConf('freeType');
        io.jsonp(context.getConf(freeType == 1 ? 'url.payGetCoupon' : 'url.freeGetCoupon'), obj, function(data) {
            if (data && data.data) {
                var msg = data.data.msg;
                var url = data.data.payAction;
                if (msg && msg.length != 0) {
                    box.alert(data.data.msg);
                    return false;
                }
                if (url && url.length != 0) {
                    location.href = url;
                }
            }
        }, function(rst) {
            box.error(rst.msg);
            if (rst.error == -100) {
                setTimeout(function() {
                    location.href = context.getConf('url.login') + '?returnUrl=' + location.href;
                }, 2000);
            }
        });
    }
    $('#jReceiveCoupon').click(function() {
        var $this = $(this);
        obj.couponId = $(this).attr('data-coupon-id');
        //绑定车牌 or 选择车牌
        if (obj.couponType == 7) {
            getCarNo(function() {
                receiveCoupon();
            });
        } else {
            receiveCoupon();
        }
    });
});
