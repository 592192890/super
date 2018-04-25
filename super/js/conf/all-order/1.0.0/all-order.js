/**
 * @file all-order.js
 * @synopsis  全部订单
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-03-16
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        box = require('common/box/1.0.0/box'),
        Tab = require('common/tab/1.0.0/tab'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        CountDown = require('lib/gallery/countdown/1.0.0/countdown'),
        backToTop = require('common/ui/nav/back2top'),
        io = require('lib/core/1.0.0/io/request'),
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'), //引入小程序对象
        cookie = require('lib/core/1.0.0/io/cookie');
    
    window.onpageshow = function(event) {
        if(event.persisted){
            window.location.reload();
        } 
    };

    //回到顶部
    var backToTop = new backToTop();
    //tab选项卡切换(每次切换初始化数据懒加载，防止数据流窜页) start 
    var tb = new Tab('.jWrap');
    var flag = false;
    $(".jWrap a").on('click', function() {
        // //当前获得active状态tab栏的data-url值
        flag = true;
        var urlTab = $(this).attr('data-url'),
            urlOpt = urlTab.split('?')[1],
            baseUrl = urlTab.split('?')[0],
            //分割接口，取得尾标数字
            category = urlOpt.split('=')[1],
            p;
        $(".jLazy").children('.jWrap').siblings().not(".back2top").empty();

        //初始化数据懒加载 start
        new LazyStream('.jLazy', {
            //jsonp接口地址
            plUrl: baseUrl,
            // plUrl: 'http://m.yunhou.com/member/orders',
            //接口参数传递
            paramFormater: function(n) {

                var data = {};
                //data写入当前tab分栏参数
                data.category = category;
                //参数p(当前页码值)，进行数据懒加载事件时，会覆盖到初始值(p:1)
                data.p = n;
                return data;
            },
            page: 1,
            errorText: '<div class="loading">网络错误，点击重试</div>',
            isSkipAboveTop: true,
            loadingClass: 'loading',
            loadingText: '<div class="ui-page-tips ui-page-loading"><img src="//ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
            // loadingText: '',
            load: function(el) {
                //图片懒加载 start
                var lazy = new Lazyload('.ui-lazy', {
                    // 加载效果
                    effect: 'fadeIn',
                    //data属性默认src <img data-src=""
                    dataAttribute: 'src',
                    // 是否跳过隐藏图片
                    skipInvisible: false,
                    //设置懒加载图片classname
                    loadingClass: 'img-loading',
                    // 设置加载前占位图片
                    placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png'
                });
                //图片懒加载 end


                //倒计时 start
                //循环遍历每一个倒计时节点，添加倒计时逻辑
                $(".jCountTime").each(function() {
                    var countDown = new CountDown({
                        targetTime: $(this).attr('data-end-time'),
                        timeText: ['', ':', ':', '后取消'],
                        container: $(this),
                        isShowTimeText: true,
                        isShowArea: true,
                        type: {
                            'd': false,
                            'h': true,
                            'm': true,
                            's': true,
                            'ms': false
                        },

                        //倒计时结束后，订单取消
                        callback: function(e) {
                            var orderId = e.parents(".product-des-ft").find(".normal-button").attr("order-id");
                            e.empty();
                            io.jsonp($('#time-out-cancel-url').val(), { orderId: orderId },
                                function() {
                                    window.location.reload();
                                },
                                function(e) {
                                    box.tips(e.msg);
                                }
                            );
                        }
                    });
                });
                //倒计时 end

                //页面逻辑 start
                //判断订单列表种类数量，种类大于1隐藏下拉展示按钮(在dom解析完成后，再判断length，需要反向绑定length)
                $(".jOrderMore").each(function(event) {
                    var li = $(this).parents('.mod-product-des').find('li');
                    var length = li.length;
                    if (length > 2) {
                        li.slice(0, 2).removeClass('product-detail').addClass('flex');
                        $(this).show();
                        $(this).parents('.jWrapMore').show();
                    } else {
                        li.removeClass('product-detail').addClass('flex');
                        $(this).hide();
                        $(this).parents('.jWrapMore').hide();
                    };
                });
                $(".jOrderMore").off("click");
                //绑定订单列表展示更多功能按钮 (反向绑定li,解决模块间同名冲突)
                $(".jOrderMore").on('click', function(event) {
                    var li = $(this).parents('.mod-product-des').find('li');
                    if ($(this).attr('data-status') == 'close') {
                        li.removeClass('product-detail').addClass('flex');
                        $(this).removeClass('close').addClass('open');
                        $(this).attr('data-status', 'open');
                    } else {
                        li.slice(0, 2).addClass('jAlwaysShow');
                        $(".jAlwaysShow").siblings().removeClass('flex').addClass('product-detail');;
                        $(".jAlwaysShow").removeClass('product-detail').addClass('flex');
                        $(this).removeClass('open').addClass('close');
                        $(this).attr('data-status', 'close');
                    };
                });
                //页面逻辑 end
                $(".payment a").off("click");
                //订单页按钮逻辑 start

                //按钮指定已绑定状态，避免重复绑定事件
                // var btn = $(".payment a");
                // if (btn.attr('data-status')!=='checked') {
                //     btn.attr('data-status', 'checked');
                // };
                //取消订单
                var dlgTmpl = [
                    '<div class="ui-contnt">',
                    '<div class="ui-select">',
                    '<select id="jCancelReason">',
                    '<option class="first" checked value="">请选择取消原因</option>',
                    '<option value="价格太高了">价格太高了</option>',
                    '<option value="拍错了，重新拍">拍错了，重新拍</option>',
                    '<option value="服务不好">服务不好</option>',
                    '<option value="不想买了">不想买了</option>',
                    '<option value="支付不成功">支付不成功</option>',
                    '<option value="其他原因">其他原因</option>',
                    '</select>',
                    '</div>',
                    '<div class="ui-wrop">',
                    '<input id="jOtherReason" class="ui-wrop-input" placeholder="请输入其他原因" />',
                    '</div>',
                    '</div>'
                ].join('');
                $(".payment a[node-type='cancelBtn']").on("click", function() {
                    var orderId = $(this).parent().attr('order-id');
                    box.alertBox(
                        dlgTmpl, {
                            title: '', //标题
                            hideClose: false //是否隐藏关闭按钮
                        }
                    ).action({
                        ok: function() {
                            var sV = $('#jCancelReason').val(),
                                sOV = $('#jOtherReason').val();

                            if (!sV && !sOV) {
                                if (!sV) {
                                    box.tips('请选择取消原因');
                                } else {
                                    box.tips('清填写取消原因');
                                }
                            }
                            io.jsonp(
                                $('#cancel-url').val(), {
                                    orderId: orderId,
                                    reason: sV || sOV
                                },
                                function() {
                                    window.location.reload();
                                },
                                function(e) {
                                    box.tips(e.msg);
                                }
                            );
                        }
                    });
                });
                //确认收货
                $(".payment a[node-type='receiptBtn']").on("click", function() {
                    var orderId = $(this).parent().attr('order-id');
                    box.confirmBox(
                        '是否确认收货？', {
                            title: '', //标题
                            hideClose: false //是否隐藏关闭按钮
                        }
                    ).action({
                        ok: function() {
                            io.jsonp(
                                $('#receive-url').val(), { orderId: orderId },
                                function() {
                                    window.location.reload();
                                },
                                function(e) {
                                    box.tips(e.msg);
                                }
                            );
                        }
                    });
                });
                //删除订单
                $(".payment a[node-type='deleteBtn']").on("click", function() {
                    var orderId = $(this).parent().attr('order-id');
                    box.confirmBox(
                        '你确定要删除订单？！', {
                            okValue: '删除',
                            cancelValue: '取消'
                        }
                    ).action({
                        ok: function() {
                            io.jsonp(
                                $('#delete-url').val(), { orderId: orderId },
                                function() {
                                    window.location.reload();
                                },
                                function(e) {
                                    box.tips(e.msg);
                                }
                            );
                        }
                    });
                });

                //去付款  付尾款
                $(".payment a[action-type='pay']").on("click", function(e) {
                    var url = $(this).attr("data-url");
                    if (url) {
                        io.jsonp(url, {},
                            function(data) {
                                if (data && data.data) {
                                    wx.miniProgram.getEnv(function(res) {
                                        if (res.miniprogram) {
                                            wx.miniProgram.reLaunch({ url: '/pages/homepage/homepage?title=线上购物&appSource=h5&source=forPay&merOrderNo=' + data.data.phpPayToken.payCode + '&payOrderNo=' + data.data.phpPayToken.payOrderNo + '&orderAmt=' + data.data.phpPayToken.payAmount })
                                            return
                                        }
                                    })
                                    if (data.data.action) {
                                        location.href = data.data.action;
                                    }
                                }
                            },
                            function(e) {
                                //box.tips(e.msg);
                            }
                        );
                    }
                });
                //订单页按钮逻辑 end

                //判断当前订单是否有按钮，没有则隐藏掉按钮区域
                $(".payment .normal-button").each(function() {
                    if ($(this).children().length == 0) {
                        $(this).parent().hide();
                    } else {
                        $(this).parent().show();
                    }
                });
            },
            // noAnyMore: '<div class="loading">仅显示最近90天的记录</div>'
            noAnyMore: ''
        });
        //初始化数据懒加载 end

        //记住列表所在位置 
        // var loaction = {
        //     init: function() {
        //         var mark = this.readCookie();
        //         (mark.scrollTop && mark.bodyHeight) ? this.srollToMark(mark): this.event();
        //     },
        //     readCookie: function() {
        //         var scrollTop = cookie.get('scrollTop');
        //         var bodyHeight = cookie.get('bodyHeight');
        //         return {
        //             'scrollTop': scrollTop,
        //             'bodyHeight': bodyHeight
        //         };
        //     },
        //     srollToMark: function(scrollTop) {
        //         var mark = Number(scrollTop.scrollTop);
        //         var height = Number(scrollTop.bodyHeight);
        //         $("html").css('min-height', height + 'px');
        //         window.scrollTo(0, mark);
        //         cookie.set('scrollTop', '0');
        //         cookie.set('bodyHeight', '0');
        //         this.event();
        //     },
        //     writeCookie: function(scrollTop, bodyHeight) {
        //         cookie.set('scrollTop', scrollTop);
        //         cookie.set('bodyHeight', bodyHeight);
        //     },
        //     event: function() {
        //         var that = this;
        //         var select = $(".mod-product-des a");
        //         $(window).on('click', select, function() {
        //             var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //             var bodyHeight = $("html").height();
        //             that.writeCookie(scrollTop, bodyHeight);
        //         });
        //     }
        // };
        // loaction.init();

    });
    //tab选项卡切换 end

    function isMiniProgram(){
        if(navigator.userAgent.toLowerCase().indexOf('miniprogram')!=-1){
            return true
        }else{
            return false
        }
    }
    
    //获取入口页的链接地址
    var getReferrer = function() {
        var referrer = '';
        try {
            referrer = window.top.document.referrer;
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer;
                } catch (e2) {
                    referrer = '';
                }
            }
        }
        if (referrer === '') {
            referrer = document.referrer;
        }
        return referrer;
    };
    var backUrl = getReferrer();
    var isFirst = true;
    window.addEventListener("popstate", function(e) {
        if (!isFirst && !flag) {
            // window.location.href = backUrl;
            // window.history.go(-1);
            // console.log(wx.miniProgram);
            wx.miniProgram.switchTab({
                url: '/pages/mycard/mycard'
            })

        }
        isFirst = false;
        flag = false;
    });

    // if(getReferrer().indexOf('member/orderDetail') != -1){

    //     function pushHistory() {  
    //         var state = {  
    //             title: "title",  
    //             url: location.href
    //         };  
    //         window.history.pushState(state, state.title, state.url);  
    //     }
        
    //     pushHistory();  

    //     window.addEventListener("popstate", function(e) {  //回调函数中实现需要的功能
    //         if (!flag) {
    //             //订单详情点返回强制回到订单列表
    //             wx.miniProgram.switchTab({
    //                 url: '/pages/mycard/mycard'
    //             })
    //         }
    //         isFirst = false;
    //         flag = false;
    //     });
    // }

    if (!window.location.hash) {
        $(".jWrap a").first().trigger('click');
    } else {
        var url = window.location.hash;
        var num = url.indexOf("#");
        var hash = url.substr(num, num + 2);
        //页面载入后首屏加载,绑定当前url #值
        $(".jWrap a").each(function() {
            if ($(this).attr("href") == hash) {
                $(this).trigger('click');
            }
        });
    };

});