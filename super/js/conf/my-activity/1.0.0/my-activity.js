/**
 * @file my-activity.js
 * @synopsis  my-activity
 * @author zhouwei, 1097009033@qq.com
 * @version 1.0.0
 * @date 2017-03-13
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box'),
        Tab = require('common/tab/1.0.0/tab'),
        loadUrl = context.getConf("url.LazyMore");
    //回到顶部
    require('common/ui/nav/back2top')();
    //图片懒加载 start
    var lazy = new Lazyload('.jImg', {
        // 加载效果
        effect: 'fadeIn',
        //data属性默认src <img data-url=""
        dataAttribute: 'url',
        // 是否跳过隐藏图片
        skipInvisible: true,
        //设置懒加载图片classname
        loadingClass: 'img-loading',
        // 设置加载前占位图片
        placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png'
    });
    //图片懒加载 end

    //页面懒加载
    var LazyLoad = new LazyStream('.jPage', {
        plUrl: loadUrl,
        /* 参数传递 */
        paramFormater: function(n) {
            var data = {};
            data.pageNo = n;
            return data;
        },
        page: 2,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="https://ssl.bbgstatic.com/super/images/common/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            //图片懒加载 start
            var lazy = new Lazyload('.jImg', {
                // 加载效果
                effect: 'fadeIn',
                //data属性默认src <img data-url=""
                dataAttribute: 'url',
                // 是否跳过隐藏图片
                skipInvisible: true,
                //设置懒加载图片classname
                loadingClass: 'img-loading',
                // 设置加载前占位图片
                placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png'
            });
            //图片懒加载 end
        },
        noAnyMore: '<div class="loading">仅显示最近90天的记录</div>'
    });
    //标签切换
    var tb = new Tab('.jWrap');
    //去付款按钮请求
    $("body").on('click', ".jBtn", function() {
        var activityId = $(this).attr("date-activiey-id");
        io.jsonp('//wx.yunhou.com/super/activity/gotosignup', { activity_id: activityId },
            function(e) {
                window.location.href = e.data.redirectUrl;
            },
            function(e) {
                box.tips(e.msg);
            }
        )
    });

    //电话拨打弹窗
    $("body").on('click', ".jConfirmBox", function(e) {
        var phone = $(e.target).attr('date-phone');
        box.confirmBox('确定拨打电话：<a id="jPhone" href="tel:' + phone + '">' + phone + '</a> 吗？', {
            title: '提示',
            okValue: '拨打',
            cancelValue: '取消'
        }).action({
            ok: function() {
                $("#jPhone").trigger("click");
            }
        });
    });
});