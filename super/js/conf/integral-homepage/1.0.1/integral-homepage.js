/**
 * @file integral-homepage.js
 * @synopsis  积分商城首页
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-06-23
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/2.0.0/js/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        LazyStream = require('common/lazystream/1.0.0/js/lazystream'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        backToTop = require('common/ui/nav/back2top'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        Slider = require('lib/ui/slider/3.0.4/slider');
    var giftPageUrl = context.getConf('url.giftPage'),
        allCityUrl = context.getConf('url.allCity');
        

                
    //回到顶部
    var backToTop = new backToTop();
    var integral = {
        store:$(".jStore"),
        sort:$(".jSort"),
        sortInf:$(".sort-inf"),
        classifyInf:$(".classify-inf"),
        sortIcon:$(".jSort i"),
        storeIcon:$(".jStore i"),
        sortInfMore:$(".sort-inf-more"),
        allTabInf: $('.jSort, .jClassify'),
        sortTag:true,
        classifyTag:true,
        classify:$(".jClassify"),
        returnDom:$(".order-inf"),

        init:function(){
            this.sliderChange();
            this.checkCookie();
            this.cityListsClick();
        },
        //绑定城市选择按钮，跳转到城市列表页
        cityListsClick:function(){//使用tap事件，防止点击穿透
            $("body").on('tap', '#jCityList', function() {
                var src = $(this).attr('data-url');
                window.location.href = src;
            });
        },
        //检查是否有城市列表页面保留的cookie值
        checkCookie:function(){
            var self = this; 
            var cityId = cookie.get("cityId"),
                cityName = cookie.get("cityName");
            if (cityName && cityId) {
                $("#jCityList").children("span").text(cityName);
                self.areaId = cityId;
                self.lazyStream();
            }else{
                $("#jCityList").children("span").text("长沙市");
                self.areaId = "430100000000";
                self.lazyStream();
            };
            //清空门店的cookie信息，防止带入非本次选择的过期门店信息
            // cookie.set("storeName",null,{domain: ".yunhou.com",path:"/"});
            // cookie.set("storeId",null,{domain: ".yunhou.com",path:"/"});
            self.screen();
        },
        //轮播图
        sliderChange:function(){
            if ($('#jSlides img').length > 0) {
                var slider = new Slider('#jSlides',
                {
                    // width: 750,
                    // height: 580,
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
            }
        },
        screen:function(){
            var self = this;
            //门店选择，滚动选择插件
            require(['common/select-scroll/1.0.0/select-scroll',
            'css!common/select-scroll/1.0.0/css/select-scroll.css',
            'jquery'
            ], function(
                SelectScroll, _, $)
            {
                var ss = new SelectScroll(
                {
                    url: allCityUrl,
                    ids: [], //selected option id
                    row: 5, //show number (3|5|7|...) ,must be odd number;
                    column: 2,
                    parentId:self.areaId,
                    level:2,
                    titles: ['请选择地区', '请选择门店'],
                    ajaxData:{}
                });
                ss.on('ok', function(obj)
                {
                    self.storesid = obj.data[1].textId;
                    self.areaId = obj.data[1].parentId;

                    var storeName = obj.data[1].text;
                    cookie.set("storeName",storeName,{domain: ".yunhou.com",path:"/"});
                    cookie.set("storeId",self.storesid,{domain: ".yunhou.com",path:"/"});
                    self.lazyStream();
                });
                $('.jStore').click(function()
                {
                    ss.show();
                    self.sortClose(self.allTabInf, self.sortInf);
                    self.classifyClose(self.allTabInf, self.classifyInf);
                    self.sortTag = true;
                    self.classifyTag = true;
                });
            });
            //智能排序点击
            self.sort.click(function() {
                    self.openOrclose($(this));
                    // $(this).siblings().removeClass('tab-line');
                    // $(this).addClass('tab-line');
            });
            //分类点击
            self.classify.click(function() {
                    self.openOrclose($(this));
                    // $(this).siblings().removeClass('tab-line');
                    // $(this).addClass('tab-line');
            });
        },
        //分类、智能排序内容展示逻辑
        openOrclose:function(that){
            var self = this;
            var type = that.attr("data-type");
            //点击智能排序tab
            if(self.sortTag && self.classifyTag && type == "sort"){//智能排序和分类都关闭状态
                self.sortOpen(that,self.sortInf);
                self.sortInf.find("li").removeClass("move");
                self.sortTag = false;
            }else if(!self.sortTag && self.classifyTag && type == "sort"){//智能排序展开，分类关闭状态
                self.sortClose(that,self.sortInf);
                self.sortClose("",self.sortInfMore);
                self.sortTag = true;
            }else if(self.sortTag && !self.classifyTag && type == "sort"){//分类展开，智能排序关闭
                self.classifyClose(self.classify,self.classifyInf);
                self.classifyTag = true;
                self.sortOpen(that,self.sortInf);
                self.sortInf.find("li").removeClass("move");
                self.sortTag = false;
            }
            
            //点击分类tab
            if (self.sortTag && self.classifyTag && type == "classify") {//智能排序和分类都关闭状态
                self.classifyOpen(that,self.classifyInf);
                self.classifyTag = false;
            }else if(self.sortTag && !self.classifyTag && type == "classify"){//分类展开，智能排序关闭
                self.classifyClose(that,self.classifyInf);
                self.classifyTag = true;
            }else if(!self.sortTag && self.classifyTag && type == "classify"){//智能排序展开，分类关闭状态
                self.sortClose(self.sort,self.sortInf);
                // self.classifyClose("",self.sortInfMore);
                self.sortTag = true;
                self.classifyOpen(that,self.classifyInf);
                self.classifyTag = false;
            };
        },
        //分类与智能排序选项展开
        sortOpen:function(that,which){
            var self = this;
            $(".order-shade").show();
            $(".order-inf").on('click', '.order-shade', function() {
                self.sortClose(self.allTabInf, self.sortInf);
                self.classifyClose(self.allTabInf, self.classifyInf);
                self.sortTag = true;
                self.classifyTag = true;
            });
            which.find("ul").addClass('sort-inf-show').removeClass('sort-inf-hide');
            function showCentent(){
                which.find('li').show(100);
            };
            setTimeout( showCentent, 200);
            if (!that) {
                return false;

            }else{
                that.children('i').addClass('jSort-icon-toggle');
            };
            that.siblings().removeClass('tab-line');
            that.addClass('tab-line');
        },
        //分类与智能排序选项收起
        sortClose:function(that,which){
            var self = this;
            $(".order-shade").hide();
            which.find('li').hide();
            which.find("ul").addClass('sort-inf-hide').removeClass('sort-inf-show');
            if (!that) {
                return false;
            }else{
                that.children('i').removeClass('jSort-icon-toggle');
            };
            that.removeClass("tab-line");
        },
        //分类与智能排序选项展开
        classifyOpen:function(that,which){
            var self = this;
            $(".order-shade").show();
            which.find("ul").addClass('classify-inf-show').removeClass('classify-inf-hide');
            function showCentent(){
                which.find('li').show(100);
            };
            setTimeout( showCentent, 200);
            if (!that) {
                return false;

            }else{
                that.children('i').addClass('jSort-icon-toggle');
            };
            that.siblings().removeClass('tab-line');
            that.addClass('tab-line');
        },
        //分类与智能排序选项收起
        classifyClose:function(that,which){
            var self = this;
            $(".order-shade").hide();
            which.find('li').hide();
            which.find("ul").addClass('classify-inf-hide').removeClass('classify-inf-show');
            if (!that) {
                return false;
            }else{
                that.children('i').removeClass('jSort-icon-toggle');
            };
            that.removeClass("tab-line");
        },
        //智能排序选项点击逻辑
        sortMore:function(){
            var self = this;
            self.sortInf.on('click', 'li', function() {
                $(this).addClass('active').siblings().removeClass("active");
                setTimeout(delayClose,300);
                function delayClose(){
                    self.sortClose(self.sort,self.sortInf);
                    self.sortTag = true;
                }
                self.sortToDo($(this));
            });  
        },
        //分类选项点击逻辑
        classifyMore:function(){
            var self = this;
            self.classifyInf.on('click', 'li', function() {
                $(this).addClass('active').siblings().removeClass("active");
                setTimeout(delayClose,300);
                function delayClose(){
                    self.classifyClose(self.classify,self.classifyInf);
                    self.classifyTag = true;
                }
                self.classifyToDo($(this));
            });
        },
        //排序逻辑
        sortToDo:function(o){
            // console.log($(this));
            var self = this;
            self.sortField = o.attr("data-param");
            self.sortType = o.attr("data-rank");
            self.lazyStream();
        },
        //分类逻辑
        classifyToDo:function(o){
            var self = this;
            self.giftType = o.attr("data-param");
            self.lazyStream();
        },




        //请求参数
        /** @param storesid 整数 门店ID;
        * @param areaId 整数 城市或镇的区域ID;
        * @param sortField 字符串 排序字段,point:兑换所需积分, shelvesTime:上架时间, sell:销量
        * @param sortType 字符串 排序类型,desc:倒叙,asc:正序
        * @param giftType 整数 礼品类型,0:商品和优惠券,1:商品,2:优惠券
        * @param pageNo 页码
        * @param pageSize 分页大小*/
        storesid:"",
        areaId:"",
        sortField:"",
        sortType:"",
        giftType:"",
        pageSize:"6",
  
        //数据懒加载
        lazyStream:function(){
            var self = this;
            var $el = self.returnDom;
            $el.empty();
            var lazyMore = new LazyStream($el, {      
                plUrl: giftPageUrl,
                /* 参数传递 */
                paramFormater: function(n)
                {
                    var data = {
                        storesid:self.storesid,
                        areaId:self.areaId,
                        sortField:self.sortField,
                        sortType:self.sortType,
                        giftType:self.giftType,
                        pageSize:self.pageSize
                    };
                    data.pageNo = n;
                    return data;
                },
                page: 1,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: 'loading',
                loadingText: '<div class="loading"><img src="//ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function() {
                    self.loadImg();
                    if ($el.children().children().length == 0) {
                        $el.html(self.emptyStr());
                        return false;
                    }
                    if($el.children(".order-shade").length<1){
                        $el.append('<div class="order-shade"></div>');
                    }
                },
                noAnyMore: '<div class="loading-txt">没有更多兑换商品啦！</div>'
            }); 
        },
        //load data
        emptyStr:function() {
            var ar = [];
            ar.push('<div class="ui-page-tips jEmptyStr">',
                '<i class="tips-img"><img src="//ssl.bbgstatic.com/super/images/common/empty/1.0.0/orders.png"/></i>', '<p class="tips-txt">没有找到可兑换商品呢，换个姿势再试一下吧！</p>', '</div>');
            return ar.join('');
        },
        //图片懒加载
        loadImg:function(){
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
                placeholder: '//ssl.bbgstatic.com/super/images/module/integral-homepage/1.0.0/error-img.png' 
            });
            //图片懒加载 end
        },   
    }
    integral.init();
    integral.sortMore();
    integral.classifyMore();   
});

