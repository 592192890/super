/**
 * @file search.js
 * @synopsis  search
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-11-16
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var Emitter = require('pub-lib/event/1.0.0/emitter');
    var IScroll = require('common/iscroll/5.0.0/build/iscroll-probe');
    var box = require('common/box/2.0.0/js/box');
    require('css!common/box/2.0.0/box.css');

    var template = require('pub-lib/template/3.0/template-simple');
    var tpl = require('text!module/address-search/1.0.0/tpl/search.tpl');
    var listTpl = require('text!module/address-search/1.0.0/tpl/list.tpl');
    var searchPopTpl = require('text!module/address-search/1.0.0/tpl/search-pop.tpl');

    template.helper('stringify', function(val) {
        return JSON.stringify(val);
    });
    //默认参数
    var defaultSetting = {
        centerCoord: {}, // center
        areaRange: [], // range
        isDeliveryUrl: './data/success.php',
        city: '长沙市',
        returnUrl: ''
    };

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }
    var search = {
        opt: {},
        init: function(opt) {
            var self = this;
            $.extend(this.opt, defaultSetting, opt);
            $('body').append(renderTmpl(tpl, {}));
            this.$search = $('#jSearchBox');
            this.$list = $('#jResearchList');
            this.loadMap();
            this.isDelivery({
                latitude: self.opt.centerCoord.lat,
                longitude: self.opt.centerCoord.lng
            }, function() {
                self.search({});
            });
            this.events();
            return this;
        },
        events: function() {
            var self = this;
            this.$search.click(function() {
                box.fullScreen(renderTmpl(searchPopTpl, {}), {
                    hideClose: true
                }).on('shown', function() {
                    var $input = $("#jSearchInput");
                    $input.on('input', function() {
                        self.$list = $('#jResearchList2');
                        self.search({
                            searchTxt: true,
                            txt: $.trim($input.val()),
														listId:'_jListId'
                        });
                    });
                });
                $("#jSearchInput").focus();
            });
            $('#jSearchClose').click(function() {
                self.opt.returnUrl.length != 0 && (window.location.href = self.opt.returnUrl);
            });
        },
        isDelivery: function(opt, callback) {
            var self = this;
            if (self.opt.isDeliveryUrl && self.opt.isDeliveryUrl.length != 0) {
                io.jsonp(self.opt.isDeliveryUrl, (opt || {}), function(data) {
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
        search: function(opt) {
            var self = this;
            var myLatlng = opt.center ? opt.center : new qq.maps.LatLng(self.opt.centerCoord.lat, self.opt.centerCoord.lng);
            //调用Poi检索类
            var searchService = new qq.maps.SearchService({
                //设置搜索页码为1
                pageIndex: 1,
                //设置每页的结果数为5
                pageCapacity: 5,
                autoExtend: true,
                complete: function(res) {
                    var pois = res.detail.pois;
                    console.log( JSON.stringify(pois))
                    self.$list.html(renderTmpl(listTpl, {
                        lists: pois,
												listId: opt.listId
                    }));
										self.scroll();
                    self.$list.find('.jItem').click(function() {
                        var $this = $(this);
												var d = $this.data('cache');
                        self.isDelivery({
                            latitude: d.latLng.lat,
                            longitude: d.latLng.lng,
                            tips: true
                        }, function() {
                            self.emit('selected', $this.data('cache'));
                        });
                    });
                    self.$list.find('input').click(function(e) {
                        e.stopPropagation();
                    });
                },
                error: function() {
                    self.$list.html(renderTmpl(listTpl, {
                        error: true
                    }));
                }
            });
            searchService.setPageCapacity(5);
            if (opt.searchTxt) {
                searchService.setLocation(self.opt.city);
                if (opt.txt.length == 0) {
                    self.$list.html('');
                } else {
                    searchService.search(opt.txt);
                }
            } else {
                searchService.searchNearBy(self.opt.city, myLatlng, 500); //by circle
            }
        },
        loadMap: function() {
            var self = this;
            //center
            var myLatlng = new qq.maps.LatLng(self.opt.centerCoord.lat, self.opt.centerCoord.lng);
            self.map = new qq.maps.Map(document.getElementById('jMap'), {
                center: myLatlng,
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                zoom: 13
            });
            self.createArea();
            //drag
            qq.maps.event.addListener(self.map, 'dragend', function() {
                var ct = self.map.getCenter();
                self.isDelivery({
                    latitude: ct.lat,
                    longitude: ct.lng
                }, function() {
                    self.$list = $('#jResearchList');
                    self.search({
                        center: self.map.getCenter()
                    });
                });
            });
        },
        createArea: function() {
            var self = this;
            $.each(self.opt.areaRange, function(i, v) {
                // circle 
                // if (v.areaType == 'circle') {
                // var radius = Number(v.points.radius);
                // new qq.maps.Circle({
                // map: self.map,
                // center: new qq.maps.LatLng(v.points.lat, v.points.lng),
                // radius: radius,
                // strokeWeight: 2,
                // strokeColor: '#ffacab',
                // fillColor: qq.maps.Color.fromHex('#ffacab', 0.3)
                // });
                // } else {
                var ar = [];
                $.each(v.points, function(i1, v1) {
                    ar.push(new qq.maps.LatLng(v1.lat, v1.lng));
                });
                new qq.maps.Polygon({
                    path: ar,
                    strokeWeight: 2,
                    map: self.map,
                    strokeColor: '#ffacab',
                    fillColor: qq.maps.Color.fromHex('#ffacab', 0.3)
                });
                // }
            });
        },
        scroll: function(i, num) {
            var self = this;
            var myScroll = new IScroll('#jResearchBox', {
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
    Emitter.applyTo(search);
    module.exports = search;
});
