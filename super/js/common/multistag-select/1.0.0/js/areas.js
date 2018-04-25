/**
 * @file areas.js
 * @synopsis  区域选择
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-12-06
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var template = require('lib/template/3.0/template');
    var areasTpl = require('text!../tpl/areas.html');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var defaultSetting = {
        data: []
    };

    function getCacheData($wrap) {
        var self = this;
        return $wrap.map(function() {
            return {
                text: $(this).attr('data-text'),
                parentId: $(this).attr('data-parent-id'),
                checked: $(this).attr('data-checked'),
                textId: $(this).attr('data-text-id')
            };
        });
    }

    function getTxt(data) {
        var self = this;
        var ar = [];
        $.each(data, function(i1, v) {
            ar.push(v.text);
        });
        return ar.join(',');
    }

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function Areas(selector, opt) {
        var self = this;
        this.opt = {};
        this.selector = selector || 'body';
        if (typeof self.selector != 'string') {
            throw 'lack of selector';
            return false;
        }
        $.extend(this.opt, defaultSetting, opt);
    }
    Areas.prototype = {
        init: function() {
            var self = this;
            self.o = $(self.selector);
            self._events();
        },
        _events: function() {
            var self = this;
            //打开面板
            $(self.selector).on('click', '.jAreasOpen', function() {
                self.o.find('.jAreas').toggleClass('mod-areas-selected');
            }).on('click', '.jMaskAreas', function() {
                $(self.selector).find('.jAreasOpen').click();
            }).on('click', '.jDeleteLi', function() {
                var deleteAr = getCacheData($(this));
                $(this).remove();
                var ar = getCacheData(self.o.find('.jAreasBd').find('.jDeleteLi'));
                if (ar.length == 0) {
                    self.setData(ar);
                } else {
                    self.o.find('.jCtnStr').html(getTxt(ar));
                }
                self.emit('deleteElm', deleteAr, getCacheData(self.o.find('.jDeleteLi')));
            }).on('click', '.jRestBtn', function() {
                var isDisabled = $(this).closest('.jAreas').hasClass('disabled');
                if (isDisabled) {
                    return false;
                }
                var ar = getCacheData(self.o.find('.jAreasBd').find('.jDeleteLi'));
                self.setData([]);
                self.emit('deleteElm', ar, getCacheData(self.o.find('.jDeleteLi')));
            }).on('click', '.jSureBtn', function() {
                var $areas = $(this).closest('.jAreas');
                var isDisabled = $areas.hasClass('disabled');
                if (isDisabled) {
                    return false;
                }
                $areas.removeClass('mod-areas-selected');
                var ar = getCacheData(self.o.find('.jAreasBd').find('.jDeleteLi'));
                self.emit('submit', ar, getTxt(ar));
            });
        },
        getLi: function(data) {
            var self = this;
            var ar = [];
            $.each(data, function(i1, v) {
                ar.push('<li class="txt-overflow tap-highlight jDeleteLi" data-text="' + v.text + '" data-text-id="' + v.textId + '" data-parent-id="' + v.parentId + '" data-checked="' + v.checked + '"  >' + v.text + '</li>');
            });
            return ar.join('');
        },
        getCheckedData: function(data) {
            var self = this;
            return $(data).map(function() {
                if (this.checked == 'true') {
                    return this;
                }
            });
        },
        setData: function(data) {
            var self = this;
            var checkData = self.getCheckedData(data);
            var liStr = self.getLi(checkData);
            var disabled = (liStr.length != 0 ? '' : 'disabled');
            $(self.selector).html(renderTmpl(areasTpl, {
                data: checkData,
                ctnStr: getTxt(checkData),
                liStr: liStr,
                disabled: disabled
            }));
        },
        show: function() {
            this.o.show();
        },
        hide: function() {
            this.o.hide();
        }
    };
    Emitter.applyTo(Areas);
    module.exports = Areas;
});
