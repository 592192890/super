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
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        Slider = require('lib/ui/slider/3.0.4/slider'),
        MultistagSelect = require('common/multistag-select/1.0.0/js/multistag-select');

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
        sortTag:true,
        classifyTag:true,
        classify:$(".jClassify"),
        // classifyTag:true,
        returnDom:$(".order-inf"),


        




        init:function(){
            this.sliderChange();
            this.screen();
            this.lazyStream();
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
            //门店选择
            var shopSelect = new MultistagSelect('_id',
            {
                // url: 'http://page.com/h5-lib/app/common/multistag-select/1.0.0/data/data.php',
                url:allCityUrl,
                checkedData: [],
                hideCheckbox: [true, true, true], //根据层级索引,判断是否隐藏checkbox;
                tabTxt: ['省区选择', '市区选择', '县区级选择','门店选择'],
                showCloseBtn: true,
                //isMultiple: false,
                title: '请选择门店',
                degree:4,//筛选层级四级

            });
            //门店点击
            self.store.click(function()
            {
                self.storeIcon.addClass('jStore-icon-toggle');
                shopSelect.show();
                $(".jClose").click(function() {
                    self.storeIcon.removeClass('jStore-icon-toggle');
                });
            });
            shopSelect.on('submit', function(obj)
            {
                
                self.storeIcon.removeClass('jStore-icon-toggle');

                self.storeToDo(obj);

            });

            //智能排序点击
            self.sort.click(function() {
                    self.openOrclose($(this));
                    var o = self.sortInf.find('li').not('.active');
                    for (var i = o.length - 1; i >= 0; i--) {
                        $(o[i]).text($(o[i]).attr("data-value"));
                    };
            });
            //分类点击
            self.classify.click(function() {
                    self.openOrclose($(this));
            });
        },
        //分类、智能排序内容展示逻辑
        openOrclose:function(that){
            var self = this;
            var type = that.attr("data-type");
            //点击智能排序tab
            if(self.sortTag && self.classifyTag && type == "sort"){//智能排序和分类都关闭状态
                self.open(that,self.sortInf);
                self.sortInf.find("li").removeClass("move");
                self.sortTag = false;
            }else if(!self.sortTag && self.classifyTag && type == "sort"){//智能排序展开，分类关闭状态
                self.close(that,self.sortInf);
                self.close("",self.sortInfMore);
                self.sortTag = true;
            }else if(self.sortTag && !self.classifyTag && type == "sort"){//分类展开，智能排序关闭
                self.close(self.classify,self.classifyInf);
                self.classifyTag = true;
                self.open(that,self.sortInf);
                self.sortInf.find("li").removeClass("move");
                self.sortTag = false;
            }
            
            //点击分类tab
            if (self.sortTag && self.classifyTag && type == "classify") {//智能排序和分类都关闭状态
                self.open(that,self.classifyInf);
                self.classifyTag = false;
            }else if(self.sortTag && !self.classifyTag && type == "classify"){//分类展开，智能排序关闭
                self.close(that,self.classifyInf);
                self.classifyTag = true;
            }else if(!self.sortTag && self.classifyTag && type == "classify"){//智能排序展开，分类关闭状态
                self.close(self.sort,self.sortInf);
                self.close("",self.sortInfMore);
                self.sortTag = true;
                self.open(that,self.classifyInf);
                self.classifyTag = false;
            };
        },
        //分类与智能排序选项展开
        open:function(that,which){
            var self = this;
            which.addClass('sort-inf-show').removeClass('sort-inf-hide');
            setTimeout( showCentent, 300);
            function showCentent(){
                which.find('li').show(100);
            };
            if (!that) {
                return false;

            }else{
                that.children('i').addClass('jSort-icon-toggle');
            };
        },
        //分类与智能排序选项收起
        close:function(that,which){
            var self = this;
            which.find('li').hide(100);
            which.addClass('sort-inf-hide').removeClass('sort-inf-show');
            if (!that) {
                return false;
            }else{
                that.children('i').removeClass('jSort-icon-toggle');
            };
        },
        //智能排序选项升降序 二级选项逻辑
        sortMore:function(){
            var self = this;
            self.sortInf.on('click', 'li', function() {
                $(this).siblings().addClass('move');
                self.sortInf.find("li").removeClass('active');
                var mine = $(this);
                mine.removeClass("active");
                var mineVal = $(this).text();
                var type = $(this).attr("data-type");
                var which = self.sortInf.siblings("."+type+"");
                self.open("",which);
                which.on('click', "li", function() {
                    if ($(this).attr("data-type") == "default") {
                        var defaultVal = $(this).attr("data-value");
                        mine.siblings().removeClass('move');
                        mine.siblings().show(300);
                        mine.text(defaultVal);
                        mine.removeClass("active");
                        self.close("",which);
                    }else{
                        var val = $(this).text();
                        mine.text(val);
                        self.close("",which);
                        mine.addClass('active');
                    };
                    which.off("click");
                    //判断所有排序是否都选择
                    var arry = self.sortInf.find("li");
                    // console.log(arry);
                    for (var i = arry.length - 1; i >= 0; i--) {
                       if ($(arry[i]).hasClass('active')) {
                            setTimeout(delayClose,400);
                            function delayClose(){
                                self.close(self.sort,self.sortInf);
                                self.sortTag = true;
                            }
                        };
                    };
                    // if ($(arry[0]).hasClass('active') && $(arry[1]).hasClass('active') && $(arry[2]).hasClass('active')) {
                    //     setTimeout(delayClose,400);
                    //     function delayClose(){
                    //         self.close(self.sort,self.sortInf);
                    //     }
                    // };
                    self.sortToDoLeveTwo($(this));
                    
                });
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
                    self.close(self.classify,self.classifyInf);
                    self.classifyTag = true;
                }
                self.classifyToDo($(this));
            });
        },
        //门店逻辑
        storeToDo:function(obj){
            // console.log(obj);
            var self = this;
            // console.log(obj.json.level);
            var json = JSON.parse(obj.json);
            // console.log(json);
            self.storesid = json.checkedData[0].textId;
            // console.log(self.storesid);
            
            var data = json.checkedData[0].parentId;
            var areaId = data.substring(0,4)+"00000000";
            // console.log(data);
            self.areaId = areaId;
            self.lazyStream();
        },
        //排序逻辑
        sortToDo:function(o){
            // console.log($(this));
            var self = this;
            self.sortField = o.attr("data-param");
        },
        sortToDoLeveTwo:function(o){
            var self = this;
            self.sortType = o.attr("data-param");
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
                container: $el,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: 'loading',
                loadingText: '<div class="loading"><img src="//ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function(el) {
                    self.loadImg();
                    if ($el.children().children().length == 0) {
                        console.log($(el));
                        $el.html(self.emptyStr());
                        return false;
                    }
                },
                noAnyMore: '<div class="loading-txt">没有更多兑换商品啦！</div>'
            }); 
        },
        //load data
        emptyStr:function() {
            var ar = [];
            ar.push('<div class="ui-page-tips jEmptyStr">',
                '<i class="tips-img"><img src="//ssl.bbgstatic.com/super/images/common/empty/1.0.0/orders.png"/></i>', '<p class="tips-txt">小步没有找到可兑换商品呢，换个姿势再试一下吧！</p>', '</div>');
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
                placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' 
            });
            //图片懒加载 end
        },
        
    }
    integral.init();
    integral.sortMore();
    integral.classifyMore();
    
});

