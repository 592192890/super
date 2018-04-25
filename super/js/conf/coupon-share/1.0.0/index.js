/**
 * @file index.js
 * @synopsis  coupon-share
 * @author yanghaitai, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-10-24
 * @modified yanghaitao
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('lib/core/1.0.0/io/request');
    var cookie = require('common/kit/io/cookie');
    var share = require('common/share/1.0.0/share');
    var box = require('common/box/2.0.0/js/box');
    var coupon = require('module/coupon-share/1.0.0/coupon/coupon');
    var couponId = context.getConf('url.couponId')||''
    var couponType = context.getConf('url.couponType')||''
    var gid = context.getConf('url.gid')||''

    //绑定车牌 or 选择车牌 ----------
    var obj = {};
    var bindCarNoPage = context.getConf('url.bindCarNoPage') + cookie.get('channel');
    obj.couponType = couponType;
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
        obj.isAjax = 1
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
                    location.href = context.getConf('login') + encodeURIComponent(location.href);
                }, 2000);
            }
        });
    }

    // receive Coupon ----------------------------
    function receiveCoupon() {
        var freeType = context.getConf('freeType');
        var b = box.loading('');
        io.jsonp(context.getConf(freeType == 1 ? 'url.payGetCoupon' : 'url.freeGetCoupon'), obj, function(data) {
            b.hide()
            if (data && data.data) {
                var msg = data.data.msg;
                var url = data.data.payAction;
                if (msg && msg.length != 0) {
                    $('#jAccount').css('display','flex')
                    return false;
                }
                if (url && url.length != 0) {
                    location.href = url;
                }
            }
        }, function(rst) {
            b.hide()
            box.error(rst.msg);
            if (rst.error == -100) {
                setTimeout(function() {
                    location.href = context.getConf('login') + encodeURIComponent(location.href);
                }, 2000);
            }
        });
    }

    var shareMod = {

        couponId:couponId||'',

        couponType:couponType||'',
        /**
         * 初始化分享
         * */
        init: function () {
            this.initShareGuide();
            this.initPops();
            this.initShare();
            this.initShop();
            this.getItNow();
            this.getData();
        },

        initPops:function(){
            $('#jAccount').width(window.innerWidth).height(window.innerHeight)
            $('.confirm,.close').click(function (e) {
                e.stopPropagation();
                $('#jAccount').hide();
                if($(this).hasClass('close')) return
                location.href = '//wx.yunhou.com/super/member'
            });
        },

        // 立即领取
        getItNow:function(){
            var self = this;
            $('#jGetItNow').on('click', function () {
                var $this = $(this);
                obj.couponId = couponId;
                //绑定车牌 or 选择车牌
                if (obj.couponType == 7) {
                    getCarNo(function() {
                        receiveCoupon();
                    });
                } else {
                    receiveCoupon();
                }
            });
        },

        fillData:function(data){
            var self = $('#jAccount')
            self.find('b').html(data.price)
            self.find('.alreadyGet').html(data.name+'已到账')
            $('.received').find('span').html(data.issued)
        },

        getData:function(){
            var self = this;
            var url= context.getConf('url.details');
            var type = this.couponType;
            var id = this.couponId;
            var params = {
                couponId:id,
                couponType:type,
                gid:gid
            }
            io.get(url, params,
                function(res) {
                    if(res.error==0){
                        $('#coupon-details').html(coupon.getHtml(res.data))
                        self.fillData(res.data)
                    }
                },
                function (e) {
                    box.error(e.msg);
                }
            );
        },

        // 初始化可选门店
        initShop:function(){
            var status;
            $('#coupon-details').on('click', '#jCheckMore',function(){
                var status = $(this).attr('status')
                if(status=='fold'){
                    $('#jCtn').addClass('unfold')
                    $(this).attr('status','unfold').html('<i class="icon iconfontmod">&#xe79b;</i> <span>收起</span>')
                }else if(status=='unfold'){
                    $('#jCtn').removeClass('unfold')
                    $(this).attr('status','fold').html('<i class="icon iconfontmod">&#xe79e;</i> <span>查看更多</span>')
                }
            })
        },
        /**
         * 判断是否微信浏览器
         * */
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 初始化页面分享组件
         */
        initShare: function () {
            var self = this;
            var shareMox = $('#jItemShareBox');
            var sharerName = context.getConf('url.sharerName');
            var shareUrl = context.getConf('url.shareUrl')+'?couponId='+this.couponId+'&sharerName='+sharerName+'&couponType='+this.couponType
            this.shareBtnsWrap = shareMox.find('.sharebuttonbox').attr("data-url", shareUrl);
            share.init({
                selector: '.sharebuttonbox'
            });
            $('#jBtnShare,#jShareTo').on('click', function(){
                if(self.isWeixin()){
                    $("#jGuide").show()
                }else{
                    shareMox.show();
                }
            });
            //关闭模态框
            $('.jCloseModalBox').on('click', function () {
                $(this).closest('.modal-box-wrap').hide();
            });
        },
        /**
         * 初始化分享导航
         * */
        initShareGuide: function () {
            var self = this;
            if (this.isWeixin()) {
                $("#jGuide").on("click", function (e) {
                    e.stopPropagation();
                    $(this).hide();
                });
            }else{
                //微信浏览器下要隐藏普通分享渠道
                $('#jHeader').show();
            }
        },

        /**
         * 分享引导
         * **/
        showGuide: function () {
            this.$guide.show();
        }
    };
    shareMod.init()
});
