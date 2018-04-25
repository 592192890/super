/**
 * @file meixi-index.js
 * @synopsis  梅溪新天地首页
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-07-06
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var box = require('common/box/1.0.0/box');
    var context = require('lib/gallery/context/1.0.0/context');
    var Slider = require('common/slider/3.0.4/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var countDown = require('lib/gallery/countdown/1.0.0/countdown');
    var banner = require('module/meixi-index/1.0.0/banner/banner');
    var jumpBtn = require('module/meixi-index/1.0.0/jump-btn/jump-btn');
    var secKill = require('module/meixi-index/1.0.0/sec-kill/sec-kill');
    var group = require('module/meixi-index/1.0.0/group/group');
    var specialMall = require('module/meixi-index/1.0.0/special-mall/special-mall');
    var browser = require('common/browser/1.0.0/browser');

        //  回到顶部
    require('common/ui/nav/back2top')();
    
    var item = {

        overtime: false,

        init: function(){
            
            this.bindEvent();

            this.getData();

        },

        lazyloading: function(arg){
            var self = this;
            new Lazyload($(arg), {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load : function(self){
                    if($(self).hasClass('img-error')){
                        $(self).removeClass('img-error').removeAttr('data-url');
                    }
                }
            });
        },

        getPx:function(val) {
            var fontSize = 46.875;
            var scale = val / fontSize;
            var htmlFontSize = $('html').css('font-size').replace('px', '');
            return parseInt(scale * htmlFontSize);
        },

        slide: function(){
            var self = this;
            var slider = new Slider('#jSlides',
            {
                width: self.getPx(750),
                height: self.getPx(320),
                navigation:
                {
                    nextArrow: '',
                    prevArrow: ''
                },
                lazyLoad:
                {
                    attr: 'data-url',
                    loadingClass: 'img-error'
                },
                play:
                {
                    auto: true,
                    interval: 4000,
                    swap: true,
                    pauseOnHover: true,
                    restartDelay: 2500
                }
            });
        },

        getData: function(){
            var self = this;
            var url = context.getConf('url.secKill');
            var circle = context.getConf('url.circle');
            var params={
                "circle": circle,
                "app": "wfuapp",
                "key":"tabContent_index"
            }
            io.jsonp(url, params, function(data) {
                /* 秒杀 */
                self.secKillInit(data);
                if(self.overtime) return;

                /* 轮播图 */ 
                self.sliderImg(data, banner);

                /* 调转按钮 */
                self.excute('jBlock', jumpBtn, 'jumpBtn', data);

                /* 预售团购 */
                self.excute('jPreGroup', group, 'preGroup', data);

                /* 专场 */
                self.excute('jPage', specialMall, 'specialMall', data);

                /* 图片懒加载 */
                self.lazyloading('img.jImg');

                self.compatible();

            }, function(e) {
                e.msg && box.error(e.msg);
            });
        },

        excute: function(id, obj, type, data){
            var $ele = $('#'+id);
            $ele.html(obj.getHtml(data));
            var ctn = data.tabContent[type];
            if(ctn.list.length==0){
                $ele.remove();
                if(type=='specialMall'){
                    if($('#jPreGroup').length>0){
                        $('#jPreGroup').addClass('btm');
                    }
                }
            }
        },

        compatible: function(){
            if($('#jPreGroup').length==0 && $('#jPage').length==0){
                $('#jSec').addClass('btm');
            }
        },

        sliderImg: function(data, banner){
            var self = this;
            $('#jBanner').html(banner.getHtml(data));
            var slid = data.tabContent.slid;
            if(slid.list.length>0){
                self.slide();               
            }else{
                $("#jSlides").remove();
            }
            
        },

        secKillInit: function(data){
            var products = data.tabContent.secKillProducts;
            var secKillBrief = data.tabContent.secKillBrief;
            $('#jSec').html(secKill.getHtml(data));
            
            if($("#jSecKill").find('a').length<=3){
                $("#jSecKill").addClass('hidden');
            }
            var moreUrl = data.tabContent.secKillBrief.secKillUrl;
            $("#jCountTime").attr("href",moreUrl);
            this.timer(data);  // 秒杀倒计时

            //  没数据 或者是 只有未开始的数据则整个模块删除
            if(products.list.length==0 || !secKillBrief.currentEndTime){
                $("#jSec").remove();
            }
        },

        timer: function(data){
            var timeText = ['',' : ',' : ',''];
            var self = this;
            var $countDown = $('#jCount');
            var obj = data.tabContent.secKillBrief;
            var target = parseInt(obj.currentEndTime*1000)

            countDown({
                container : $countDown,
                targetTime : target,
                type : {'d':false,'h':true,'m':true,'s':true,'ms':false},
                labelCtn: 'i',
                timeText : timeText,
                isShowTimeText: true,
                callback : function() {
                    self.overtime = true;
                    $("#jSecKill").removeClass('hidden');
                    self.getData();
                }
            });
        },

        bindEvent: function(){
            var payToUrl = context.getConf('url.payToUrl');
            var loginUrl = context.getConf('url.login');
            var payUrl;

            var param = {
                "type":"pay"
            }
            $("#jScan").click(function(){
                io.jsonp(payToUrl, param, function(res){
                    if(res.data){
                        payUrl = res.data.pay_url;
                        window.location.href = payUrl;
                    }
                },function(e){
                    window.location.href = loginUrl + location.href;
                })
            });


            $("#jTab a").click(function(e){
                if(browser.isAndroid()){
                    $(this).addClass('active').siblings().removeClass('active');
                }
                if($(this).hasClass('home')){
                    e.preventDefault();
                    window.location.reload()  // 兼容android
                }
            });

            $(window).scroll(function(){
                if($(window).scrollTop() >= 320){
                    $("#jNavi").addClass("active")
                }else{
                    $("#jNavi").removeClass("active")
                }
            });
        }
    };

    item.init();

});
