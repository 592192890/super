/**
 * @file select-scroll.js
 * @synopsis  select scroll
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-06-28
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('pub-lib/event/1.0.0/emitter');
    var template = require('pub-lib/template/3.0/template-simple');
    var io = require('pub-lib/io/1.0.0/request');
    var IScroll = require('common/iscroll/5.0.0/build/iscroll-probe');
    var box = require('common/box/2.0.0/js/box');
    var tpl = require('text!./select-scroll.tpl');
    var itemTpl = require('text!./item.tpl');
    var liHeight = getPx(60);
    var defaultSetting = {
        titles: ['请选择', '请选择', '请选择', '请选择'],
        parentId: 0,
        level: 0,
        ids: [], //selected option id
        row: 5, //show number (3|5|7|...) ,must be odd number;
        column: 3,
        ajaxData: {}
    };

    function getPx(val) {
        var fontSize = 46.875;
        var scale = val / fontSize;
        var htmlFontSize = $('html').css('font-size').replace('px', '');
        return parseInt(scale * htmlFontSize);
    }

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function SelectScroll(opt) {
        var self = this;
        this.opt = {};
        $.extend(this.opt, defaultSetting, opt);
        this.opt.className = 'mod-select-scroll-' + self.opt.row;
    }
    SelectScroll.prototype = {
        show: function() {
            var self = this;
            var num = 0;
            self.opt._itemTpl = self.createItemTpl();
            box.bottom(renderTmpl(tpl, self.opt)).on('shown', function() {
                self.o = $('#_jSelectScroll');
                self.$scrollBd = self.o.find('._jScrollBd');
                self.addTpl(0, self.opt.parentId);
            }).action({
                ok: function() {
                    self._loaded = false;
                    self.emit('ok', self.getData());
                },
                cancel: function() {
                    self._loaded = false;
                }
            });
            return this;
        },
        createItemTpl: function() {
            var ar = [];
            var self = this;
            for (var i = 0; i < self.opt.column; i++) {
                ar.push('<div class="bd-item _jUlBox" id="_jUlBox' + i + '"></div>');
            }
            return ar.join('');
        },
        _setLi: function(_items, num) {
            var self = this;
            var len = (self.opt.row - Math.ceil(self.opt.row / 2));
            var items = [].concat(_items);
            $.each(items, function(i, item) {
                if (items[0]) {
                    items[0].selected = 'selected';
                }
                item['index'] = i;
            });
            for (var i1 = 0; i1 < len; i1++) {
                items.unshift({
                    'text': (i1 == 0 ? self.opt.titles[num] : '')
                });
                items.push({
                    'text': ''
                });
            }
            return items;
        },
        addTpl: function(index, parentId, callback) {
            var self = this;

            function n(parentId, num) {
                if (num != self.opt.column) {
                    self.add(parentId, num, function(data) {
                        var _parentId = data._items[0]['textId'];
                        var $ul = self.o.find('._jUlBox').eq(num);
                        if (self.opt.ids[num] && !self._loaded) {
                            _parentId = self.opt.ids[num];
                        }
                        $ul.replaceWith(data._tpl);
                        self.scroll(parentId, num);
                        num++;
                        n(_parentId, num);
                        if (num == self.opt.column) {
                            self._loaded = true;
                            callback && callback(data);
                        }
                    });
                }
            }
            n(parentId, index);
        },
        add: function(parentId, num, callback) {
            var self = this;
            var data = {};
            io.jsonp(self.opt.url, $.extend({
                parentId: parentId,
                level: (self.opt.level + num)
            }, self.opt.ajaxData, true), function(rs) {
                if ($.isEmptyObject(rs) || $.isEmptyObject(rs.data)) {
                    self.o.find('._jUlBox').eq(num).html('');
                    return false;
                }
                data._items = rs.data;
                data.items = self._setLi(rs.data, num);
                data.parentId = parentId;
                data._tpl = (renderTmpl(itemTpl, data));
                $.extend(data, self.opt);
                callback && callback(data);
            });
        },
        scroll: function(i, num) {
            var self = this;
            var $this = $('#_jUlBox' + i);
            var $lis = $this.find('._jLi');
            var myScroll = new IScroll('#_jUlBox' + i, {
                scrollY: true,
                probeType: 3
            });
            myScroll.on('scrollEnd', function() {
                //scrollTo pos ----
                var y = Math.abs(this.y);
                var diffY = y % liHeight;
                var lastY = 0;
                var index = 0;
                if (diffY >= liHeight / 2) {
                    index = Math.ceil(y / liHeight);
                } else {
                    index = Math.floor(y / liHeight);
                }
                lastY = index * liHeight;
                myScroll.scrollTo(0, -lastY);

                //selected option ------
                var _index = index + (Math.ceil(self.opt.row / 2) - 1);
                var $li = $lis.eq(_index);
                var parentId = $li.attr('data-id');
                $lis.removeClass('selected');
                $li.addClass('selected');

                //scoll next ----
                var ulIndex = self.o.find('._jUlBox').index($this.closest('._jUlBox'));
                var top = $this.attr('data-top');
                if ((top == null && -lastY != 0) || (top != null && top != -lastY)) {
                    self.addTpl(ulIndex + 1, parentId);
                }
                $this.attr('data-top', -lastY);
            });

            //scrollTo default position;
            if (!self._loaded) {
                var $li = $this.find('[data-id="' + self.opt.ids[num] + '"]');
                var _i = $li.attr('data-index');
                var h = Number('-' + (liHeight * _i)) || 0;
                $this.attr('data-top', h);
                myScroll.scrollTo(0, h);
                if ($li.length != 0) {
                    $lis.removeClass('selected');
                    $li.addClass('selected');
                }
            }
        },
        getData: function() {
            var self = this;
            var obj = {};
            var ids = [];
            var texts = [];
            return {
                data: self.o.find('._jLi.selected').map(function() {
                    var id = $(this).attr('data-id');
                    var parentId = $(this).attr('data-parent-id');
                    var text = $(this).text();
                    ids.push(id);
                    texts.push(text);
                    return {
                        textId: id,
                        parentId: parentId,
                        text: text
                    }
                }).get(),
                ids: ids,
                texts: texts
            };
        }
    };
    Emitter.applyTo(SelectScroll);
    module.exports = SelectScroll;
});