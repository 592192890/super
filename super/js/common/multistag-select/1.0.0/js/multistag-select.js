/**
 * @file multistag-select.js
 * @synopsis  多级选择
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-12-05
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var template = require('lib/template/3.0/template');
    var io = require('lib/core/1.0.0/io/request');
    var mSelectTpl = require('text!../tpl/multistag-select.html');
    var Areas = require('./areas');
    var defaultSetting = {
        checkedUrl: '',
        url: 'http://test.data.com/m/api/getCategory.php',
        tabTxt: ['业态选择', '省区选择', '地区选择', '区域选择', '门店选择'],
        checkedData: [], //多选的数据
        showCloseBtn: true, //是否显示关闭按钮
        title: '请选择',
        hideCheckbox: [], //根据层级索引,判断是否隐藏checkbox;
        degree: 3, //默认3级
        isMultiple: true
    };

    function getArr(data, filter, value) {
        var ar = [];
        $.each(data, function(i, v) {
            if (filter) {
                if (v[filter] == value) {
                    ar.push(v);
                }
            } else {
                ar.push(v);
            }
        });
        return ar;
    }

    function turnToArr(obj) {
        var ar = [];
        $.each(obj, function(k1, v) {
            ar.push(v);
        });
        return ar;
    }

    function turnToObj(ar, filter) {
        var obj = {};
        $(ar).each(function(i, v) {
            if (filter) {
                if (v[filter]) {
                    obj[v[filter]] = {};
                    obj[v[filter]] = v
                }
            } else {
                ar.push(v);
            }
        });
        return obj;
    }

    function getCacheData($wrap) {
        return $wrap.map(function() {
            return {
                text: $(this).attr('data-text'),
                parentId: $(this).attr('data-parent-id'),
                checked: $(this).attr('data-checked'),
                textId: $(this).attr('data-text-id')
            };
        });
    }

    //判断对象是否为空

    function isEmptyObject(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function MultistagSelect(id, opt) {
        var self = this;
        this.opt = {};
        this.id = id;
        this.selector = 'body';
        this.areas = new Areas('._jAreas' + self.id);
        $.extend(this.opt, defaultSetting, opt);
    }

    MultistagSelect.prototype = {
        init: function(callback) {
            var self = this;
            if (self._isFirst) {
                self._getData(self.opt.checkedUrl, {}, function(rs) {
                    if (rs && rs.data) {
                        self.opt.checkedData = rs.data;
                    }
                    self._createHtml();
                    self.o = $('#' + self.id);
                    self.$tabsWrap = self.o.find('.jBdLeft');
                    self.$ctnWrap = self.o.find('.jRightWraps');
                    self._addTab([], 0, 0);
                    self.events();
                    self._selectedOpt(0);
                    self._isFirst = false;
                    self.areas.init();
                    callback && callback();
                    self.areas.setData(self.opt.checkedData);
                    self.areas.on('deleteElm', function(d, checkData) {
                        self.setData(d, self.$ctnWrap);
                        self.opt.checkedData = checkData;
                    });
                    self.areas.on('submit', function(data, text) {
                        self.emit('submit', {
                            data: data,
                            text: text,
                            parentIds: self.getParentIds(),
                            level: self.opt.level,
                            json: self.getJson(data, text)
                        });
                        self.hide();
                    })
                });
            } else {
                callback && callback();
            }
        },
        getParentIds: function() {
            var self = this;
            var ar = [];
            self.$tabsWrap.find('li').each(function(i, v) {
                if (!(i > self.opt.level) && (i != 0)) {
                    ar.push($(this).attr('data-parent-id'));
                }
            });
            return ar;
        },
        getJson: function(data1, data2) {
            var self = this;
            return JSON.stringify({
                checkedData: data1,
                level: self.opt.level,
                text: data2
            });
        },
        setData: function(data, $wrap) {
            var self = this;
            if (!$wrap) {
                self.o && self.o.find('.jLiElm').attr('data-checked', 'false').find('[name=jChkElm]').prop('checked', false);
                return false;
            }
            $(data).each(function(k, v) {
                var $e = $wrap.find('[data-text-id="' + v['textId'] + '"][data-parent-id="' + v['parentId'] + '"][data-checked="true"]');
                if ($e && $e.length != 0) {
                    $e.attr('data-checked', 'false').find('[name=jChkElm]').prop('checked', false);
                }
            });
        },
        _isFirst: true,
        //选中
        _selectedOpt: function(index) {
            var self = this;
            var $tabs = self.$tabsWrap.find('li');
            $tabs.eq(index).click();
        },
        _addTab: function(data, index, parentId, isHiddenTab) {
            var self = this;
            var $tabs = self.$tabsWrap.find('li');
            var ar = [];
            var ar2 = [{
                textId: '',
                parentId: parentId,
                text: self.opt.tabTxt[index] || '请选择',
                checked: 'false'
            }];
            var flag = ($tabs.length != 0 && $tabs.eq(index).length != 0);
            //新增tab
            if (!flag && !isHiddenTab) {
                self.$tabsWrap.append(self._createTabItem(ar2, false));
            }
            //当前tab替换文字
            if (flag && data && data.length != 0) {
                $tabs.eq(index).replaceWith(self._createTabItem(ar2, false));
            }
            //上一个tab
            if (data && data.length != 0) {
                ar = data;
                $tabs = self.$tabsWrap.find('li');
                $tabs.eq(index - 1).replaceWith(self._createTabItem(ar, false));
            }
            $tabs = self.$tabsWrap.find('li');
            $tabs.removeClass('selected').eq(index).addClass('selected');
        },
        _hideOtherTab: function($tabs, index) {
            var self = this;
            $tabs.each(function(i, v) {
                if (i > index) {
                    $(this).hide();
                } else {
                    $(this).show();
                };
            });
        },
        _addCtn: function(opt, index, $elm, callback) {
            var self = this;
            var $ctns = self.$ctnWrap.find('.jRightWrap');
            var parentId = opt.parentId;
            var flag = ($ctns.length != 0 && $ctns.eq(index).length != 0);
            var isRequest = (!flag || $ctns.eq(index).attr('data-parent-id') != parentId);
            var parentIdData = getArr(self.opt.checkedData, 'parentId', parentId);
            $ctns.hide();
            self.$ctnWrap.addClass('loading');
            if (isRequest) {
                self._getData(self.opt.url, {
                    parentId: opt.parentId,
                    level: index
                }, function(data) {
                    self.$ctnWrap.removeClass('loading');
                    if (parentIdData.length != 0 && data.data && data.data.length != 0) {
                        data.data = turnToArr($.extend(turnToObj(data.data, 'textId'), turnToObj(parentIdData, 'textId'), true));
                    }
                    if (data.data && data.data.length != 0) {
                        var _flag = !self.opt.hideCheckbox[index];
                        var html = '<ul>' + self._createTabItem(data.data, _flag, index, opt.textId) + '</ul>';
                        if (flag) {
                            $ctns.eq(index).attr('data-parent-id', parentId).html(html).show();
                        } else {
                            self.$ctnWrap.append('<div class="right-wrap jRightWrap" data-parent-id=' + parentId + ' data-index="' + index + '">' + html + '</div>');
                        };
                        $ctns = self.$ctnWrap.find('.jRightWrap');
                        $ctns.eq(index).show();
                        callback && callback();
                    } else {
                        if ($elm) {
                            $elm.removeClass('icon-pos-lft');
                        }
                    }
                    self.emit('ctnDataLoad');
                });
            } else {
                self.$ctnWrap.removeClass('loading');
                callback && callback();
                $ctns.eq(index).show();
            }
        },
        _getData: function(url, data, callback) {
            var self = this;
            if (url && url.length != 0) {
                io.jsonp(url, (data || {}), function(data) {
                    callback && callback(data);
                });
            } else {
                callback && callback();
            }
        },
        show: function() {
            var self = this;
            self.init(function() {
                self.o && self.o.addClass('animate-l-r');
                $('html').addClass('html-overflow-hidden');
            });
        },
        hide: function() {
            var self = this;
            self.o && self.o.removeClass('animate-l-r');
            $('html').removeClass('html-overflow-hidden');
            self.emit('hide');
        },
        _createTabItem: function(data, flag, index, id) {
            var self = this;
            var ar = [];
            var arrowStr = (flag && (self.opt.degree - 1 != index) ? 'icon-pos-lft' : '');
            $.each(data, function(k, v) {
                var checkedStr = ''
                if (v['checked'] == 'true') {
                    checkedStr = ' checked';
                }
                ar.push('<li data-parent-id="' + v['parentId'] + '" data-text-id="' + v['textId'] + '" data-text="' + v['text'] + '"  data-checked="' + v['checked'] + '" class="jLiElm txt-overflow" >',
                    '<div class="right-inner ' + arrowStr + ' txt-overflow">' + v['text'] + '</div>');
                if (flag) {
                    ar.push('<input type="checkbox" ' + checkedStr + ' name="jChkElm"/>');
                }
                ar.push('</li>');
            });
            return ar.join('');
        },
        _createHtml: function() {
            var self = this;
            $(self.selector).append(renderTmpl(mSelectTpl, {
                id: self.id,
                showCloseBtn: self.opt.showCloseBtn,
                title: self.opt.title
            }));
        },
        showNextCtn: function($this) {
            var self = this;
            var $li = $this.closest('.jLiElm');
            var $parent = $this.closest('.jRightWrap');
            var $liInner = $parent.find('.right-inner');
            var index = Number(self.o.find('.jRightWrap').index($parent));
            var textId = $li.attr('data-text-id');
            $liInner.removeClass('selected');
            $this.addClass('selected');
            var _d = getCacheData($li);
            if (index != self.opt.degree - 1) {
                self._addCtn({
                    parentId: textId
                }, index + 1, $this, function() {
                    self._addTab(_d, index + 1, textId);
                });
            } else {
                self._addTab(_d, index + 1, textId, true);
                self.$tabsWrap.find('li').removeClass('selected').eq(index).addClass('selected');
            }
            self._hideOtherTab(self.$tabsWrap.find('.jLiElm'), (index + 1));
        },
        checked: function($this) {
            var self = this;
            var isChecked = $this.prop('checked');
            var $wrapLi = $this.closest('.jRightWrap');
            var index = $wrapLi.attr('data-index');
            $this.closest('.jLiElm').attr({
                'data-checked': (isChecked ? 'true' : 'false')
            });
            var $lis = $wrapLi.find('[data-checked="true"]');
            var data = getCacheData($lis);
            self.opt.level = index;
            self.clearOtherChecked(index);
            self.areas.setData(data);
        },
        events: function() {
            var self = this;
            self.o.on('click', '.jBdLeft .jLiElm', function() {
                var index = self.$tabsWrap.find('.jLiElm').index($(this));
                var parentId = $(this).attr('data-parent-id');
                var textId = $(this).attr('data-text-id');
                self._addCtn({
                    parentId: parentId,
                    textId: textId
                }, index, false, function() {
                    self._addTab([], index, parentId);
                });
            }).on('click', '.jRightWrap .right-inner', function() {
                var index = $(this).closest('.jRightWrap').attr('data-index');
                if (index == self.opt.degree - 1) {
                    var $liElm = $(this).closest('.jLiElm');
                    var $check = $liElm.find('[name=jChkElm]');
                    var isChecked = $check.prop('checked');
                    $check.prop('checked', !isChecked);
                    self.cancelOtherCheckbox($liElm.attr('data-text-id'));
                    self.checked($check);
                };
                self.showNextCtn($(this));
            }).on('click', '.jClose', function() {
                self.hide();
            }).on('click', '[name=jChkElm]', function() {
                var $liElm = $(this).closest('.jLiElm');
                var index = $(this).closest('.jRightWrap').attr('data-index');
                if (index == self.opt.degree - 1) {
                    self.showNextCtn($liElm.find('.right-inner'));
                    self.cancelOtherCheckbox($liElm.attr('data-text-id'));
                };
                self.checked($(this));
            })
        },
        cancelOtherCheckbox: function(id) {
            var self = this;
            if (self.opt.isMultiple) {
                return false;
            }
            self.o.find('[name=jChkElm]').each(function(i, v) {
                var $liElm = $(this).closest('.jLiElm');
                if ($liElm.attr('data-text-id') != id) {
                    $(this).prop('checked', false);
                    $liElm.attr('data-checked', 'false');
                }
            });
        },
        clearOtherChecked: function(index) {
            var self = this;
            var $wraps = self.$ctnWrap.find('.jRightWrap');
            $wraps.each(function(i, v) {
                if (i != index) {
                    $(v).find('.jLiElm').attr('data-checked', 'false');
                    $(v).find('[name=jChkElm]').prop('checked', false);
                }
            });
            self.opt.checkedData = [];
        },
        setCheckedData: function(val) {
            this.checkedData = val;
            this.areas.setData([]);
            this.setData();
        },
        getCheckedData: function(d) {
            var self = this;
            var ars = self.opt.checkedData;
            if (ars.length != 0) {
                $.each(ars, function(i, v) {
                    if (v.textId == d.textId) {
                        if (d.checked == 'false') {
                            [].splice.call(ars, i, 1);
                        } else {
                            [].splice.call(ars, i, 1, d);
                        }
                        return false;
                    } else if (i == ars.length - 1) {
                        if (d.checked == 'true') {
                            ars.push(d);
                        }
                    }
                });
            } else {
                if (d.checked == 'true') {
                    ars.push(d);
                }
            }
            self.opt.checkedData = ars;
            return ars;
        }
    };
    Emitter.applyTo(MultistagSelect);
    module.exports = MultistagSelect;
});
