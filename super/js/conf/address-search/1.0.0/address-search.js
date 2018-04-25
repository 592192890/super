/**
 * @file address-search.js
 * @synopsis  address
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-11-16
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var box = require('common/box/2.0.0/js/box');
    var context = require('lib/gallery/context/1.0.0/context');
    var cookie = require('common/kit/io/cookie');
    require('css!common/box/2.0.0/box.css');

    var search = require('module/address-search/1.0.0/search');
    var isDeliveryUrl = context.getConf('url.isDeliveryUrl');
    var getArea = context.getConf('url.getArea');
    var searchAddress = context.getConf('url.searchAddress');

    var template = require('pub-lib/template/3.0/template-simple');
    var tpl = require('text!module/address-search/1.0.0/tpl/search-tab.tpl');
    var listTpl = require('text!module/address-search/1.0.0/tpl/list-search.tpl');
    var searchPopTpl = require('text!module/address-search/1.0.0/tpl/search-pop.tpl');
    var IScroll = require('common/iscroll/5.0.0/build/iscroll-probe');

    if(window.__wxjs_environment !== 'miniprogram'&& !isMiniProgram()){
        var geolocation = new qq.maps.Geolocation("VT6BZ-V6DRX-2VT4G-7LYAK-Z6V7V-DMBQ4", "myapp");
    }
    
    template.helper('stringify', function(val) {
        return JSON.stringify(val);
    });

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    //定义替换参数的方法
    function changeURLArg(url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    }

    function getRef() {
        var url = '';
        if (document.referrer != '') {
            var ref = document.referrer;
            if (ref.indexOf('__r=') < 0) {
                url = ref.indexOf('?') > -1 ? ref + '&__r=' + Date.now() : ref + '?__r=' + Date.now();
            } else {
                url = changeURLArg(ref, '__r', Date.now());
            }
        }
        return url;
    }


    function isMiniProgram(){
        if(navigator.userAgent.indexOf('miniprogram')>-1){
            return true
        }else{
            return false
        }
    }

    //debounce 时间间隔 t 内若再次触发事件，则重新计时，直到停止时间大于或等于 t 才执行函数。
    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }
    //默认参数
    var addressSearch = {
        init: function() {
            // 小程序去掉地图
            if(window.__wxjs_environment === 'miniprogram'|| isMiniProgram()){
                this.smallProgrem()
                return
            }

            io.jsonp(getArea, {}, function(res) {
                if (!res || !res.data) {
                    return;
                }
                var data = res.data;
                geolocation.getLocation(function(pos) {
                    search.init({
                        city: pos.city,
                        // areaRange: [
                        // "112.913361, 28.226970,1656.0748124518655",
                        // '112.93790817260742,28.225608802167226/112.92778015136719,28.213659423562117/112.95061111450195,28.207306044917736/112.95747756958008,28.22470130135556'
                        // ],
                        areaRange: data,
                        centerCoord: {
                            lat: pos.lat,
                            lng: pos.lng
                        },
                        returnUrl: getRef(),
                        isDeliveryUrl: isDeliveryUrl
                    }).on('selected', function(data) {
						cookie('_detailAddress', JSON.stringify(data), {path: "/"});
                        (getRef().length != 0) && (location.href = getRef());
                    });
                });
            })
        },

        smallProgrem: function(){
            $('body').append(renderTmpl(tpl, {}));
            this.$search = $('#jSearchBox');
            this.$list = $('#jResearchList');
            this.events()
        },

        events: function() {
            var self = this;
            var $input = $("#jSearchInput");
            $input.focus().on('input propertychange', debounce(function() {
                var txt = $.trim($input.val());
                self.$list = $('#jResearchList2');
                if(!txt||txt==''){
                    self.$list.html('');
                    return
                }
                self.search({
                    keyword: txt,
                    listId:'_jListId'
                });
            }, 900));
            // this.$search.click(function() {
            //     box.fullScreen(renderTmpl(searchPopTpl, {}), {
            //         hideClose: true
            //     }).on('shown', function() {
            //         var $input = $("#jSearchInput");
            //         $input.on('input propertychange', debounce(function() {
            //             var txt = $.trim($input.val())
            //             self.$list = $('#jResearchList2');
            //             if(!txt||txt==''){
            //                 self.$list.html('')
            //                 return
            //             }
            //             self.search({
            //                 keyword: txt,
            //     		       listId:'_jListId'
            //             });
            //         }, 900));
            //     });
            //     $("#jSearchInput").focus();
            // });
            $('#jSearchClose').click(function() {
                window.location.href = getRef()
            });
        },

        search: function(opt){
            var self = this;
            var pois
            io.jsonp(searchAddress, {keyword:opt.keyword||''}, function(data) {
                if(data.error){
                    box.error(data.msg)
                    return
                }
                if(data.data&&data.data.navigation){
                    pois = data.data.navigation
                    self.$list.html(renderTmpl(listTpl, {
                        lists: pois,
                        listId: opt.listId,
                        changeTxt:true
                    }));
                    self.scroll();
                    self.$list.find('.jItem').click(function() {

                        // 处理
                        var $this = $(this);
                        var d = $this.data('cache');
                        self.isDelivery({
                            latitude: d.latLng.lat,
                            longitude: d.latLng.lng,
                            tips: true
                        }, function() {
                            cookie('_detailAddress', JSON.stringify(d), {path: "/"});
                            (getRef().length != 0) && (location.href = getRef());
                        });
                    });
                    // self.$list.find('input').click(function(e) {
                    //     e.stopPropagation();
                    // });
                }
            });
            
            //var pois = [{"latLng":{"lat":28.202055,"lng":112.870346},"id":"17039450990466875787","name":"长沙五星旅馆","address":"湖南省长沙市岳麓区一师安置小区B12栋1单元","phone":"18673654878","postcode":" ","category":"酒店宾馆:经济型酒店","dist":105.83,"type":0},{"latLng":{"lat":28.2035,"lng":112.87522},"id":"1715556578675064174","name":"长沙银行ATM(东塘南丰港安置小区东)","address":"湖南省长沙市岳麓区枫林三路822湖南涉外经济学院","phone":" ","postcode":" ","category":"银行金融:自动提款机","dist":398.8,"type":0},{"latLng":{"lat":28.200188,"lng":112.871689},"id":"16091708290280081265","name":"长沙馨缘家庭旅馆","address":"湖南省长沙市岳麓区丁字湾翻身街涉外学院斜对面","phone":"18874262990","postcode":" ","category":"酒店宾馆:旅馆招待所","dist":243.66,"type":0},{"latLng":{"lat":28.20288,"lng":112.87149},"id":"6511969056081380817","name":"甜蜜旅馆","address":"湖南省长沙市岳麓区麓松路涉外西门南丰港小区8栋对面","phone":"18874194328","postcode":" ","category":"酒店宾馆:旅馆招待所","dist":59.4,"type":0},{"latLng":{"lat":28.20314,"lng":112.86968},"id":"15451188184645397223","name":"1976精品旅馆","address":"湖南省长沙市岳麓区东塘五期安置小区17栋","phone":"0731-88737999","postcode":" ","category":"酒店宾馆:旅馆招待所","dist":186.92,"type":0}]
            //pois = []
            
        },

        isDelivery: function(opt, callback) {
            var self = this;
            if (isDeliveryUrl&& isDeliveryUrl.length != 0) {
                io.jsonp(isDeliveryUrl, (opt || {}), function(data) {
                    if (!data.data && opt.tips) {
                        box.tips('当前地址不支持配送!');
                        return;
                    }
                    if (!data.data && !opt.tips) {
                        self.$list.html(renderTmpl(listTpl, {
                            lists: []
                        }));
                        return;
                    }
                    callback && callback(data);
                });
            }
        },

        scroll: function(i, num) {
            var self = this;
            var myScroll = new IScroll('#_jListId', {
                scrollY: true,
                // click: false,
                preventDefaultException: {
                    tagName: /.*/
                },
                probeType: 3
            });
            myScroll.on('scrollEnd', function() {
            });
        }
    };
    addressSearch.init();
});
