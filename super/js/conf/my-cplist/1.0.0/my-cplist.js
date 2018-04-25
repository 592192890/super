/**
 * @file my-cplist.js
 * @synopsis  my-cplist
 * @author zhouwei, 1097009033@qq.com
 * @version 1.0.0
 * @date 2017-04-14
 * @modify leaytam
 * @date 2017-5-27
 * 优惠券二维码
 * @modify yanghaitao
 * @date 2017-12-05
 * 通用券与门店券切换
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('common/box/2.0.0/js/box');
    var io = require('lib/core/1.0.0/io/request');
    var Tab = require('common/tab/2.0.0/tab');
    var getCommonCouponUrl = context.getConf('url.getCommonCoupon') // 通用券
    var getCouponUrl = context.getConf('url.getCoupon'); // 门店券
    var couponType = context.getConf('couponType')
    var tb1 = null;
    //回到顶部
    require('common/ui/nav/back2top')();

    var tb = new Tab('.jWrap1', {
        loaded: function(obj) {
            loadData(obj.$ctn, getCouponUrl);
        }
    });
    tb.on('tabClick', function(obj) {
        loadData(obj.$ctn,getCouponUrl);
    });

    //通用券与门店券切换
    $("#jTicketChange li").click(function(){
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active')
        $('.mod-tab').eq(index).show().siblings('.mod-tab').hide()
        if(index==1){
            if(tb1) return    // 门店券绑定加载数据
            tb1 = new Tab('.jWrap', {
                loaded: function(obj) {
                    loadData(obj.$ctn,getCommonCouponUrl);
                }
            });
            tb1.on('tabClick', function(obj) {
                loadData(obj.$ctn,getCommonCouponUrl);
            });
        }
    })

    //规则展示
    $('.page-view').on('click', '.jShowCouponInfo ', function() {
        var $arrow = $(this).find('.jCouponArrow');
        var $ctn = $(this).find('.jItemCtn');
        var isVisible = $ctn.is(':visible');
        $arrow[isVisible ? 'show' : 'hide']();
        $ctn[isVisible ? 'hide' : 'show']();
    });

    $('.page-view').on('click', '.jQrBox', function() {
        var ar = $(this).attr('data-qr');
        if (ar && ar.length != 0) {
            ar = JSON.parse(ar);
            var str = [
                '<div class="qr-dialog">',
                '<img src="' + ar[0] + '" class="qr-barcode"/>',
                '<img src="' + ar[1] + '" class="qr-code">',
                '<div class="tips">请向门店工作人员展示此码</div>',
                '</div>'
            ].join('');
            box.alert(str, {hideClose:'none'});
        }
    });

    //load data
    function emptyStr(type) {
        var ar = [];
        ar.push('<div class="ui-page-tips jEmptyStr">',
            '<i class="tips-img"><img src="https://img4.bbgstatic.com/15b22cfccb3_bc_8ef75d7040bab77688ecb2168931c0fc_308x266.png"/></i>', '<p class="tips-txt">暂无数据</p>', '</div>');
        return ar.join('');
    }

    function loadData($el, plUrl) {
        var classStr = $el.attr('data-id');
        var type = $el.attr('data-type');
        var plUrl = plUrl
        // if(couponType==2){  //  停车优惠券
        //     plUrl = getCouponUrl
        // }
        if ($el.find('[data-page]').length != 0 || $el.find('.jEmptyStr').length != 0) {
            return false;
        }
        var lay = new LazyStream('[data-id=' + classStr + ']', {
            plUrl: plUrl,
            container: $el[0],
            /* 参数传递 */
            paramFormater: function(n) {
                var data = {};
                data.pageNo = n;
                data.type = type;
                data.isAjax = 1;
                data.couponType = couponType;
                return data;
            },
            page: 1,
            isSkipAboveTop: true,
            errorText: '<div class="loading-txt"> 网络错误， 点击重试 </div>',
            loadingClass: '',
            loadingText: '<div class="loading-txt">正在加载，请稍后...</div>',
            load: function(el) {
                if (!el || $(el).children().length == 0 && $el.find('.jCoupon').length == 0) {
                    $el.html(emptyStr(type));
                    return false;
                }
                //load pic
                var lazy = new Lazyload('.jImg', {
                    // 加载效果
                    effect: 'fadeIn',
                    //data属性默认src <img data-src=""
                    dataAttribute: 'src',
                    // 是否跳过隐藏图片
                    skipInvisible: true,
                    //设置懒加载图片classname
                    loadingClass: 'img-loading',
                    // 设置加载前占位图片
                    placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png'
                });
            },
            noAnyMore: '<div class="loading-txt">没有更多数据了</div>'
        });
    }

});