/**
 * @file list.js
 * @synopsis  combination list
 * @author yanghaitao, 
 * @version 1.0.0
 * @date 2017-12-20
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('lib/core/1.0.0/io/request');

    // tab --------
    var Tab = require('common/tab/2.0.0/tab');
    var tb = new Tab('.jWrap', {
        loaded: function(obj) {
            loadData(obj.$ctn);
        }
    });
    tb.on('tabClick', function(obj) {
        loadData(obj.$ctn);
    });

    //load data
    function emptyStr(type) {
        var ar = [];
        // var msg = ['券', '商场券', '商家券', '超市券', '券'];
        ar.push('<div class="ui-page-tips jEmptyStr">',
            '<i class="tips-img"><img src="http://img4.bbgstatic.com/15b22cfccb3_bc_8ef75d7040bab77688ecb2168931c0fc_308x266.png"/></i>', '<p class="tips-txt">没有可领取的券</p>', '</div>');
        return ar.join('');
    }

    function loadData($el) {
        var classStr = $el.attr('data-id');
        var type = $el.attr('data-type');
        if ($el.find('[data-page]').length != 0 || $el.find('.jEmptyStr').length != 0) {
            return false;
        }
        var lay = new LazyStream('[data-id=' + classStr + ']', {
            plUrl: context.getConf('url.getCoupon'),
            // container: $el[0],
            /* 参数传递 */
            paramFormater: function(n) {
                var data = {};
                data.pageNo = n;
                data.type = type;
                data.isAjax = 1;
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
                    placeholder: '//s1.bbgstatic.com/super/images/common/error-img.png'
                });
            },
            noAnyMore: '<div class="loading-txt">仅显示最近90天的记录</div>'
        });
        //receive coupon;
        // $el.on('click', '.jReceive', function() {
        // var $this = $(this);
        // var $wrap = $this.closest('.jCoupon');
        // var id = $wrap.attr('data-id');
        // io.jsonp(context.getConf('url.receiveCoupon'), {
        // id: id
        // }, function() {
        // $wrap.addClass('coupon-selected');
        // }, null, $this);
        // });
    }
});
