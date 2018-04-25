/**
 * @file good-lists.js
 * @synopsis  商品列表+商品搜索+商品筛选
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-04-17
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
        cookie = require('lib/core/1.0.0/io/cookie');
    var $_get = require('lib/core/1.0.0/utils/util').parseParams(location.search);

    var goods = {
        urlTab: '',
        urlOpt: '',
        baseUrl: '', //接口地址
        rqsUrl: '', //筛选页请求接口地址
        paraOne: '',
        paraTwo: '',
        sortField: '', //分栏参数
        sortOrder: '', //排序值
        isOrderPrice: '', //正序？倒序？价格栏标记
        isOrderSale: '', //正序？倒序？商品栏标记
        lastClick: 'default', //上一次发生点击事件的菜单栏类别
        keyword: '', //搜索词
        keywordAll: '', //搜索记录
        urlHash: '', //hash值
        searchHistoryArea: $(".search-page .search-history"), //搜索记录块
        searchBar: $(".good-lists #jSearchLink"), //列表页搜索区域
        searchBarP: $(".search-page #jSearchLink"), //搜索页搜索区域
        searchInput: $(".search-page #jSearchLink input"),
        searchThink: $(".search-page .search-think"),
        tabsLink: $(".jWrap a"), //菜单栏a标签
        dataLazy: $(".jLazy"), //数据懒加载区域
        goodLists: $(".good-lists"), //商品列表页
        searchPage: $(".search-page"), //搜索模块
        lazyImg: '.ui-lazy', //需要懒加载的图片
        back: $(".good-lists .mod-search-bar .left"), //列表页回退按钮
        backMod: $(".search-page .mod-search-bar .left"), //搜索模块回退按钮
        searchBtn: $(".search-page .mod-search-bar .right"), //搜索按钮
        emptyBtn: $("#jEmpty"),
        modLists: $(".mod-lists"), //商品区域(数据懒加载填充区域)
        // searchThinkUrl: '/super/search/autocomplete', //商品联想接口地址
        searchThinkUrl: '/super/search/index', //商品联想接口地址
        jPage: $(".jPage"),
        /*
         *self.option:对象内部访问, 会覆盖初始变量值
         *this.option:函数内部访问, 函数执行结束销毁
         */

        //初始化
        init: function() {
            this.bindEvent();
        },

        //绑定tab点击事件
        bindEvent: function() {
            var self = this;
            var tb = new Tab('.jWrap'); //实例化tab点击切换样式
            self.tabClick(self.tabsLink);
        },

        //菜单栏点击事件
        tabClick: function(tabsLink) {
            var self = this;
            tabsLink.on('click', function(el) {
                self.urlTab = $(this).attr('data-url');
                //获取接口地址
                self.baseUrl = self.urlTab.split('?')[0];
                //参数块
                self.urlOpt = self.urlTab.split('?')[1];
                self.paraOne = self.urlOpt.split('&')[0];
                self.paraTwo = self.urlOpt.split('&')[1];
                //当前分栏值
                self.sortField = self.paraOne.split('=')[1];
                //当前排序值
                self.sortOrder = self.paraTwo.split('=')[1];

                //切换排序值,没看懂前不要改动
                if ($(this).attr("data-type") == "price" && self.lastClick == "price") { //如果是价格栏
                    if (!self.isOrderPrice) {
                        self.isOrderPrice = "positive";
                    };
                    if (self.isOrderPrice && self.isOrderPrice == "positive") {
                        self.isOrderPrice = "inverted";
                        self.sortOrder = "asc";
                        $(this).find(".icon").empty().html("&#xe77f;");
                    } else if (self.isOrderPrice && self.isOrderPrice == "inverted") {
                        self.isOrderPrice = "positive";
                        self.sortOrder = "desc";
                        $(this).find(".icon").empty().html("&#xe77d;");
                    };
                } else if ($(this).attr("data-type") == "price" && self.lastClick !== "price") {
                    if (!self.isOrderPrice) {
                        self.isOrderPrice = "inverted";
                    };
                    if (self.isOrderPrice && self.isOrderPrice == "positive") {
                        // self.isOrderPrice = "inverted";
                        self.sortOrder = "desc";
                        $(this).find(".icon").empty().html("&#xe77d;");
                    } else if (self.isOrderPrice && self.isOrderPrice == "inverted") {
                        // self.isOrderPrice = "positive";
                        self.sortOrder = "asc";
                        $(this).find(".icon").empty().html("&#xe77f;");
                    };
                };
                if ($(this).attr("data-type") == "sales" && self.lastClick == "sales") { //如果是销量栏
                    if (!self.isOrderSale) {
                        self.isOrderSale = "positive";
                    };
                    if (self.isOrderSale && self.isOrderSale == "positive") {
                        self.isOrderSale = "inverted";
                        self.sortOrder = "asc";
                        $(this).find(".icon").empty().html("&#xe77f;");
                    } else if (self.isOrderSale && self.isOrderSale == "inverted") {
                        self.isOrderSale = "positive";
                        self.sortOrder = "desc";
                        $(this).find(".icon").empty().html("&#xe77d;");
                    };
                } else if ($(this).attr("data-type") == "sales" && self.lastClick !== "sales") {
                    if (!self.isOrderSale) {
                        self.isOrderSale = "inverted";
                    };
                    if (self.isOrderSale && self.isOrderSale == "positive") {
                        // self.isOrderSale = "inverted";
                        self.sortOrder = "desc";
                        $(this).find(".icon").empty().html("&#xe77d;");
                    } else if (self.isOrderSale && self.isOrderSale == "inverted") {
                        // self.isOrderPrice = "positive";
                        self.sortOrder = "asc";
                        $(this).find(".icon").empty().html("&#xe77f;");
                    };
                }

                if ($(this).attr("data-type") == "filter") {
                    self.jPage.hide();
                    self.jPage.siblings().not($(".back2top")).empty();
                    self.rqsUrl = ""; //点击筛选后清除掉筛选接口  
                } else {
                    self.jPage.siblings().not($(".back2top")).empty();
                };
                //清除当前栏内容

                var data = {
                    'sortField': self.sortField,
                    'sortOrder': self.sortOrder,
                    'keyword': self.keyword
                };
                //判断是否有筛选条件?将接口替换为带筛选参数的接口:继续使用之前接口
                if (self.rqsUrl) {
                    self.baseUrl = self.rqsUrl;
                };
                //发送请求，第一页数据，第一页参数(pageNo)约定不传
                io.jsonp(
                    self.baseUrl,
                    data,
                    function(rst) {
                        if (rst.data) {
                            var html = rst.data;
                            self.modLists.html(html);
                            self.lazyLoad();
                            //初始化执行筛选逻辑
                            self.screening();
                            // self.search();
                        };
                    },
                    function(e) {
                        box.tips(e.msg);
                    }
                );
                //留存该次点击类型标记
                self.lastClick = $(this).attr("data-type");
                self.lazyStream();
            });
        },
        //筛选页逻辑
        screening: function() {
            //筛选逻辑
            var self = this;
            var urlArgument2Obj = function() {
                var o = {},
                    urlA = window.location.search.replace(/^[?]/, '').split('&'),
                    key = '',
                    value = '';

                for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
                    if (urlA[ia] !== '') {
                        key = urlA[ia].split('=')[0];
                        value = urlA[ia].split('=')[1];
                        o[key] = decodeURIComponent(value);
                    }
                }
                return o;
            };
            //choose show animate
            // $('.jChooseShow').on('click', function () {
            //     // window.location.hash = "filter";
            //     var div = $('.page-view');

            //     $('html').toggleClass(div.attr('data-animate'));

            //     window.onhashchange = function () {
            //         if (location.hash == "") {
            //             closeFilter();
            //         }
            //     };

            //     return false;
            // });
            // //  close choose
            // function closeFilter() {
            //     var div = $('.page-view');
            //     $('html').removeClass(div.attr('data-animate'));
            // }

            $('.choose .jClose').on('click', function() {
                self.jPage.show();
                self.tabsLink.first().trigger('click');
            });

            //  toggle show and hide
            $('.choose dt').on('click', function() {
                var div = $(this).siblings('dd').find('ul');
                $(this).parent().toggleClass("choose-open");
                var li = div.find('li');

                if (div.height() === 0) {
                    div.height(li.height() * li.length);
                } else {
                    div.height(0);
                }
            });

            //  choose url

            //  base url
            // var url = window.location.href.replace(/[?#].*?$/, '');
            // var url = self.baseUrl;
            var url = window.location.href + "/get_page_data";

            //  clear all
            $('.jChooseClear').on('click', function() {
                $('.jCon').removeClass('active');
                $('[data-node-type=choose-pros]').text("");
                $('#jPriceFormLi').attr('data-value', '');
                $('#jConhs').attr('data-value', '3');
            });

            //  add condition
            $('.jCon').on('click', function() {
                var $this = $(this);
                var closestDl = $this.closest('dl');
                var closestDt = $this.closest('dt');
                $this.toggleClass('active');
                if (closestDl.find('dt').attr('data-type') === 'priceLeft,priceRight') {
                    closestDl.find('.jCon').removeClass('active');
                    $this.addClass('active');
                } else if (closestDt.attr('data-type') === 'hasStore') {
                    if (closestDt.hasClass('active')) {
                        closestDt.attr('data-value', '1');
                    } else {
                        closestDt.attr('data-value', '3');
                    }
                }

                // 填充选中的属性数值
                var args = [];
                $this.parent().children('li').each(function(k, v) {
                    if ($(v).hasClass("active")) {
                        args.push($(v).children("span").text());
                    }
                });
                closestDl.find('dt [data-node-type=choose-pros]') ? closestDl.find('dt [data-node-type=choose-pros]').text(args.join(",")) : "";
            });

            // 输入价格区间
            var inputPriceStart = $('#jInputPriceStart'),
                inputPriceEnd = $('#jInputPriceEnd'),
                pricesHolder = $('#jPricesHolder'),
                priceFormLi = $('#jPriceFormLi');

            $('#jBtnConfirmPrices').on('click', function() {

                var priceStart = parseInt(inputPriceStart.val() * 100),
                    priceEnd = parseInt(inputPriceEnd.val() * 100),
                    priceStartT = (inputPriceStart.val() * 1).toFixed(2),
                    priceEndT = (inputPriceEnd.val() * 1).toFixed(2),
                    args = [];

                priceStart > 9999900 && (priceStart = 9999900);
                priceEnd > 10000000 && (priceEnd = 10000000);

                priceStartT > 99999 && (priceStartT = 99999.00);
                priceEndT > 100000 && (priceEndT = 100000.00);

                if (priceStart >= 0 && priceEnd > 0 && priceEnd > priceStart) {
                    $('.choose-l-r .jCon').removeClass('active');
                    pricesHolder.text(priceStartT + '-' + priceEndT);
                    priceFormLi.attr('data-value', priceStart + ',' + priceEnd).addClass('active');
                }

            });

            if ($_get['hasStore'] && $_get['hasStore'] == '1') {
                $('#jConhs').addClass('active').attr('data-value', '1');
            }

            if ($_get['priceLeft'] && $_get['priceRight']) {
                inputPriceStart.val(parseInt($_get['priceLeft']) / 100);
                inputPriceEnd.val(parseInt($_get['priceRight']) / 100);
                $('#jBtnConfirmPrices').trigger('click');
            }

            var o = urlArgument2Obj();

            //  commit
            $('.jChooseCommit').on('click', function() {
                $('._wap-choose dt').each(function(i) {
                    var a = $(this).attr('data-type') ? $(this).attr('data-type').split(',') : [];
                    for (var i = 0, len = a.length; i < len; i = i + 1) {
                        if (o.hasOwnProperty(a[i])) {
                            delete o[a[i]];
                        }
                    }
                });

                var s = '',
                    key = '',
                    value = '';

                $('._wap-choose dl').each(function(i) {
                    //  是否有货
                    if (i === 0) {
                        key = $(this).find('dt').attr('data-type');
                        value = $(this).find('dt').attr('data-value');

                        //  一般情况
                    } else {
                        key = $(this).find('dt').attr('data-type');
                        value = '';
                        $(this).find('dd ul .active').each(function(idx) {
                            if (idx !== 0) {
                                value += '|';
                            }
                            value += $(this).attr('data-value');
                        });
                    }

                    if (value !== '') {
                        //  拆分价格
                        if (key === 'priceLeft,priceRight') {
                            o[key.split(',')[0]] = value.split(',')[0];
                            o[key.split(',')[1]] = value.split(',')[1];
                        } else if (o.hasOwnProperty(key)) {
                            o[key] += '_' + value;
                        } else {
                            o[key] = value;
                        }
                    }
                });

                for (var p in o) {
                    s += '&' + p + '=' + encodeURIComponent(o[p]);
                }
                // window.location.href = url + s.replace('&', '?');
                self.rqsUrl = url + s.replace('&', '?');
                // var data = "";
                // box.tips(self.rqsUrl);
                self.jPage.show();
                self.tabsLink.first().trigger('click');

            });
        },
        //数据懒加载
        lazyStream: function() {
            var self = this;
            new LazyStream(self.dataLazy, {
                //jsonp接口地址
                plUrl: self.baseUrl,
                //接口参数传递
                paramFormater: function(n) {

                    var data = {};
                    //data写入当前tab分栏参数
                    data.sortField = self.sortField;
                    //参数pageNo(当前页码值)
                    data.pageNo = n;
                    //data写入当前分栏排序(正序，倒序)
                    data.sortOrder = self.sortOrder;
                    data.keyword = self.keyword;
                    return data;
                },
                page: 2,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: 'loading',
                // loadingText: '<div class="ui-page-tips ui-page-loading"><img src="//ssl.bbgstatic.com/super/images/common/loading/loading.gif" class="load-gif" />正在加载，请稍后...</div>',
                loadingText: '<div class="ui-page-tips ui-page-loading"><i class="tips-img"></i><p class="tips-txt">数据加载中...</p></div>',
                load: function(el) {
                    //回到顶部
                    self.lazyLoad();
                    // self.search();

                },
                noAnyMore: ''
            });
        },
        //搜索模块基本功能
        search: function() {
            var self = this;
            //列表页点击搜索区进入搜索模块
            self.searchBar.on('click', function() {
                self.goodLists.hide();
                self.searchPage.show();
                self.searchInputEvent();
                self.searchHistory();
                self.searchCore();
                //商品联想
                self.searchInput.on('input', function() {

                    //获取搜索词,填充搜索记录
                    self.keyword = self.searchInput.val();
                    self.searchProduct();
                });

            });
            //回退按钮，回到商品列表页
            self.backMod.on('click', function() {
                self.backGoodLists();
            });
            //清空搜索历史功能
            self.emptyBtn.on('click', function() {
                self.searchHistoryArea.empty();
                cookie.set("keywordAll", '');
                self.keywordAll = "";

            });
        },
        //搜索模块核心功能
        searchCore: function() {
            var self = this;
            //点击搜索，获取keyword值
            self.searchBtn.on('click', function() {
                if (self.keyword) {
                    self.backGoodLists();
                    var firstLink = self.tabsLink.first();
                    // 缓存搜索词记录
                    self.keywordAll = self.keywordAll + "_" + self.keyword;
                    cookie.set("keywordAll", self.keywordAll);
                    self.rqsUrl = "";
                    firstLink.trigger('click');
                    self.searchBtn.off("click");
                } else {
                    box.tips("你还没有输入关键词呢~");
                };
            });
        },
        //回退显示商品列表
        backGoodLists: function() {
            var self = this;
            self.goodLists.show();
            self.searchInput.siblings('i').hide();
            self.searchInput.attr('placeholder', '');
            self.searchInput.val('');
            self.searchInput.attr('autofocus', 'autofocus');
            self.searchPage.hide();
            window.history.go(-1); //清掉hash值
        },
        //图片懒加载
        lazyLoad: function() {
            var self = this;
            var lazy = new Lazyload(self.lazyImg, {
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
        //搜索框焦点获取，取消事件
        searchInputEvent: function() {
            var self = this;
            self.searchInput.on('focus', function() {
                $(this).siblings('i').hide();
                $(this).attr('placeholder', '');
                $(this).val('');
            });
            self.searchInput.on('blur', function() {
                $(this).siblings('i').show();
                $(this).attr('placeholder', '搜索你想要的商品');

            });
        },

        //搜索框商品联想  
        searchProduct: function() {
            var self = this;
            if (self.keyword) {
                var key = {
                    keyword: self.keyword
                };
                io.jsonp(
                    self.searchThinkUrl,
                    key,
                    function(rqs) {
                        if (rqs.data.cateLink.name) {
                            self.searchThink.empty();
                            rqs.data.cateLink.name.each(function(e) {
                                console.log(e);
                                self.searchThink.html('<li><a href="">' + e + '</a></li>');
                            });
                        };
                    });
                self.searchThink.show();
            } else {
                self.searchThink.hide();
            };

        },
        //更新并填充搜索记录
        searchHistory: function() {
            //获取搜索记录
            var self = this;
            self.keywordAll = cookie.get("keywordAll");
            //更新搜索记录
            var his = self.keywordAll.split("_");
            self.searchHistoryArea.empty();
            for (var i = 1; i < his.length; i++) {
                self.searchHistoryArea.append('<li><a href="">' + his[i] + '</a></li>');
            };
        }
    }

    //回到顶部
    var backToTop = new backToTop();
    goods.init();
    $(".jWrap a").first().trigger('click');
    goods.lazyLoad();
    goods.search();
    cookie.set("keywordAll", "");
});
