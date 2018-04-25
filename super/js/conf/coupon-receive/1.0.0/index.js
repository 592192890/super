/**
 * @file index.js
 * @synopsis  coupon-receive
 * @author yanghaitai, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-10-25
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var io = require('lib/core/1.0.0/io/request');
    var share = require('common/share/1.0.0/share');
    var box = require('common/box/2.0.0/js/box');
    var shareUrl = window.location.href;
    var getQueryString = function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var couponId = getQueryString('couponId')||''
    var couponType = getQueryString('couponType')||''

    var shareMod = {

        smsTime:60,

        getCode:$('.line span'),

        inputCode:$('.inputCode'),
        
        telNum:'',

        flag: false,  // 是否正在请求验证码
        /**
         * 初始化分享
         * */
        init: function () {
            this.initShareGuide();
            this.initPops();
            this.initShare();
            this.getItNow()
            this.vertification()
        },

        vertification:function(){
            var self = this
            this.getCode.on('click', function () { // 获取验证码
                if (self.isTelephone()) {
                    self.sendSms();
                } else {
                    box.error("手机号码不正确，请重新填写")
                }
            })

            this.inputCode.on('input propertychange', function () { // 输入验证码
                self.verifCode();
            })

        },

        // 验证短信号码
        verifCode: function () {
            this.verfCode = this.inputCode.val();
            if (/^\d{5}$/g.test(this.verfCode)) {
                return true
            } else {
                return false
            }
        },

        // 判断电话号码
        isTelephone: function () {
            this.telNum = $('.inputTel').val();
            if (/^1[34578]\d{9}$/g.test(this.telNum)) {
                return true;
            } else {
                return false;
            }
        },

        // 发送短息
        sendSms: function () {
            var self = this;
            var json = {
                "mobile": this.telNum,
                "callback": 'json'
            }
            if(this.flag) return
            this.loading = box.loading('');
            var smsUrl= context.getConf('url.getVerifyCode');
            io.post(smsUrl, json, function (rst) {
                self.loading.hide();
                self.flag = true
                if (rst.error === 0 || rst.error === "0") {
                    if (rst.data && rst.data.leftSecond) {
                        self.smsTime = parseInt(rst.data.leftSecond);
                        self.countDown();
                    }
                }
            }, function (e) {
                self.loading.hide();
                e.msg && box.error(e.msg);
                self.inputCode.val('');
                self.getCode.html('重新获取')
            });
        },

        countDown: function () {
            var self = this;
            this.timeId = setInterval(function () {
                self.smsTime--;
                self.getCode.html(self.smsTime + 's');
                if (self.smsTime === 0) {
                    self.flag = false
                    self.inputCode.val('');
                    self.timeId && clearInterval(self.timeId);
                    self.getCode.html('重新获取')
                }
            }, 1000)
        },

        getQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        // 立即领取
        getItNow:function(){
            console.log(222)
            var self = this;
            var url= context.getConf('url.getCoupon');
            $('#jGetItNow').on('click', function(){
                var params = {
                    captcha:self.inputCode.val() || '',
                    couponId:couponId,
                    couponType:couponType,
                    mobile:self.telNum
                }
                self.loading = box.loading('')
                io.get(url, params,
                    function(res) {
                        self.loading.hide()
                        $('#jAccount').css('display','flex')
                    },
                    function (e) {
                        self.loading.hide()
                        box.error(e.msg);
                        if(e.error==-100){
                            setTimeout(function(){
                                window.location.href = '//wx.yunhou.com/super/passport/login?channel=011&returnUrl='+ encodeURIComponent(window.location.href)
                            },2000)
                        }  
                    }
                );
            });
        },

        initPops:function(){
            $('#jAccount').width(window.innerWidth).height(window.innerHeight)
            $('.confirm').click(function (e) {
                e.stopPropagation();
                location.href = '//wx.yunhou.com/super/member?channel=011'
            });
            $('.close').click(function (e) {
                e.stopPropagation();
                $('#jAccount').hide();
                window.location.reload()
            });
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
        }
    };

    shareMod.init()
});
