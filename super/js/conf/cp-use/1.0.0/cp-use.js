/**
 * @description  使用优惠券
 * @author licuiting 250602615@qq.com
 * @date 2015-02-11 17:25:44
 * @modify zhouwei 1097009033@qq.com
 * @modify-date 2017-04-05 10:11:13
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery'),
        dialog = require('common/ui/dialog/dialog'),//提示消息
        template = require('common/template/1.0.1/template'), //模板
        context = require('lib/gallery/context/1.0.0/context'),
        cpTpl = require('text!tpl/cp-use/1.0.0/cp-use.tpl'),
        com = require('module/order/1.0.0/common/common'),
        cpUrl = context.getConf("url"), refUrl;
    //回到顶部
    require('common/ui/nav/back2top')();

    // 加上时间戳  
    function convertUrl(url) {  
        var timestamp = (new Date()).valueOf();  
        if (url.indexOf("?") >= 0) {  
            url = url + "&t=" + timestamp;  
        } else {  
            url = url + "?t=" + timestamp;  
        }  
        return url;  
    }

    //强制跳转刷新 兼容ios
    if(document.referrer.indexOf('wx.yunhou.com/super/item') != -1){
        refUrl = convertUrl(document.referrer)
    }

    window.addEventListener("popstate", function(e) {  //回调函数中实现需要的功能
        location.replace(refUrl);
    }, false);


    var useCoupon = {
        defaultSetting: {
            url: cpUrl,
            dialog: dialog,
            selector: ''
        },
        //初始化
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.getCouponsList();
            self.setCouponValue();
            self.event();
            self.hideClass()
        },
        // 隐藏样式
        hideClass: function(){
            if($('.ul-line').find('li').length==0){
                $('.ul-line').hide()
            }
        },
        //事件
        event: function() {
            var self = this;
            // 站外优惠券---确定或取消优惠券
            $('#jUseCoupon').on('click', '#jSubBtn', function() {
                    // 优惠券名称;
                    var $this = $(this);
                    var $parent = $('#jUseCoupon'); // parent
                    var $tips = $('#msg'); // 提示信息对象;
                    var shopId = self.getUrlParam('shopId');
                    var msg = ['请输入优惠券券码', '不能输入~#^$@%&!*\'<>等字符']; // 验证输入信息
                    var $coupon = $('#jCouponInput'); // 优惠券对象
                    var $val = $coupon.val(); // 站外优惠券内容
                    var isEmpty = $.trim($val).length == 0; // 是否为空
                    var isHasSpChar = self.isHasSpChar($.trim($val)); // 是否包含特殊字符
                    var isCancel = $parent.find('.selected').hasClass('active');
                    // 验证是否为空,是否包含特殊字符;
                    if (isEmpty || isHasSpChar) {
                        self.dialog.tips({
                            cnt: msg[(isEmpty ? 0 : 1)],
                            time: 1000
                        });
                    } else {
                        $tips.hide();
                        // 使用或取消优惠券
                        com.ajax(self.url[isCancel ? 'cancelOffers' : 'useOffers'], {
                            couponType: 'out',
                            code: $val,
                            shopId: shopId
                        }, function(data) {
                            // 有数据就显示
                            if (data) {
                                self.dialog.tips({
                                    cnt: isCancel ? '已取消使用优惠券' : '使用优惠券成功',
                                    time: 1000
                                }, function() {
                                    location.href = self.getUrlParam('source')=='direct'?context.getConf("url.directOrder"):context.getConf("url.normalOrder");//self.getUrlParam('source') + '.html?isRefresh=1';
                                });
                            }
                        }, function() {
                            $coupon.focus();
                        });
                    }
                })
                //点击使用优惠券
                .on('click', '.jCouponItem', function(e) {
                    var $target = $(e.target);
                    var $this = $(this);
                    var $selector = $(this).siblings('.selected');
                    $selector.hasClass('active') ? $selector.removeClass('active') : $selector.addClass('active');
                    var _this = this;
                    var $parent = $('#jUseCoupon'); // 父级
                    var shopId = self.getUrlParam('shopId'); // shopId
                    var _cCode = self.getUrlParam('code'); // 优惠券码
                    var attrValue = $(this).attr('data-value'); // 缓存的优惠券的值
                    // var isCancel = $parent.find('.selected').hasClass('active');
                    // com.ajax(self.url[isCancel ? 'cancelOffers' : 'useOffers'], {
                    com.ajax(self.url['useOffers'], {
                        couponType: 'in',
                        shopId: shopId,
                        // code: $(this).attr('data-value')
                        code: $this.parent(".jCouponItems").attr('data-value')
                    }, function(data) {
                        if (data) {
                            self.dialog.tips({
                                cnt: '使用优惠券成功!',
                                time: 1000
                            }, function() {
                                location.href = self.getUrlParam('source')=='direct'?context.getConf("url.directOrder"):context.getConf("url.normalOrder");
                            });
                        }
                        $this.removeClass('active');
                    }, function(e) {
                        self.dialog.tips({
                            cnt: e,
                            time: 1000
                        });
                        $this.addClass('active');
                    });
                })
                // 取消使用优惠券
                .on('click', '#jBtnCancelCoupon', function() {
                    var _cCode = self.getUrlParam('code'); // 优惠券码
                    com.ajax(self.url['cancelOffers'], {
                        couponType: 'in',
                        buyType: self.getUrlParam('source'),
                        shopId: self.getUrlParam('shopId'),
                        code: $(this).attr('data-value')
                    }, function(data) {
                        if (data) {
                            self.dialog.tips({
                                cnt: '已取消使用优惠券!',
                                time: 1000
                            }, function() {
                                location.href = self.getUrlParam('source')=='direct'?context.getConf("url.directOrder"):context.getConf("url.normalOrder");//self.getUrlParam('source') + '.html?isRefresh=1';
                            });
                        }
                    });
                })
                //下拉展示
            $('#jUseCoupon').on('click', '.jShowCouponInfo ', function() {
                var $arrow = $(this).find('.jCouponArrow');
                var $ctn = $(this).closest('.jItemBox').find('.jItemCtn');
                var $section = $(this).closest('.jCouponList');
                var $allCtn = $section.find('.jItemCtn');
                var isVisible = $ctn.is(':visible');
                var $allArrow = $section.find('.jShowCouponInfo').find('.jCouponArrow');
                $allCtn.hide();
                $allArrow.show();
                $arrow[isVisible ? 'show' : 'hide']();
                $ctn[isVisible ? 'hide' : 'show']();
            })
        },
        //获取购买类型
        _getBuyType: function() {
            //购买流程( normal原流程, direct立即购买 )
            return this.getUrlParam('source');
        },
        //获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        },
        // 验证特殊字符
        isHasSpChar: function(val) {
            var reg = /[~#^$@%&!*'<>]/gi;
            return reg.test(val);
        },
        // 获取优惠券列表
        getCouponsList: function() {
            var _self = this;
            var $availableCouponItems = $('#jAvailableCouponItems');//可使用
            var $invalidCouponItems = $('#jInvalidCouponItems');//已使用
            var $expiredCouponItems = $('#jExpiredCouponItems');//已失效
            var $parent = $('#jUseCoupon');
            var shopId = _self.getUrlParam('shopId');
            var _cType = _self.getUrlParam('type');
            var _cCode = _self.getUrlParam('code');
            com.ajax(_self.url['orderUrl'], {
                shopId: shopId,
                buyType: _self._getBuyType()
            }, function(data) {
                if(data.data['available'].length||data.data['invalid'].length||data.data['expired'].length){
                    $('.coupon-list-header').show()
                }
                $availableCouponItems.html(_self.createCouponsStr(data.data['available'], 'available'));
                $invalidCouponItems.html(_self.createCouponsStr(data.data['invalid'], 'invalid'));
                $expiredCouponItems.html(_self.createCouponsStr(data.data['expired'], 'expired'));
                if (data.data['available'].length === 0) {
                    $availableCouponItems.addClass('active');
                }

                if (_cType && _cType == 'in') {
                    (!_cCode || _cCode.length == 0) ? _cCode = 'null': '';
                    $availableCouponItems.attr('data-value', _cCode);
                    $availableCouponItems.find('.coupon-' + _cCode).addClass('active');
                }
            });
        },
        //设置优惠券码的值
        setCouponValue: function() {
            var _cType = this.getUrlParam('type');
            var _cCode = this.getUrlParam('code');
            if (_cType == 'out' && _cCode && _cCode.length != 0) {
                $('#jCouponInput').val(_cCode);
                $('#jSubBtn').text('取消').addClass('active');
            }
        },
        //渲染模板
        createCouponsStr: function(data, type) {
            var str = '';
            var itemClass = '';
            for (var i = 0; i < data.length; i++) {
                if (type === 'available') { // 可用的优惠券
                    itemClass = 'jCouponItems'; 
                }
                else if (type === 'invalid') { // 已使用的优惠券
                    itemClass = 'jCouponItems'+' cp-used';
                }
                else if (type === 'expired') { // 已失效的优惠券
                    itemClass = 'jCouponItems'+' cp-fail';
                }
                data[i]['class'] = itemClass;
            }
            str = template.compile(cpTpl)({couponList: data});//渲染模板
            return str;
        }
    };
    useCoupon.init();
});