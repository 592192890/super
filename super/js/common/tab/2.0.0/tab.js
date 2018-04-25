/**
 * @file tab.js
 * @synopsis  slide tab
 * @author licuiting, 250602615@qq.com
 * @version 2.0.0
 * @date 2017-05-22
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var _ = require('./stop');
    var defaultSetting = {
        'tabs': '[role=tabItem]',
        'ctns': '[role=tabPanel]',
        'line': '[role=line]',
        'tabInner': '[role=tabInner]',
        'hoverClass': 'active',
        loaded: function() {}
    };

    function Tab(selector, opt) {
        var self = this;
        this.opt = {};
        this.selector = selector;
        $.extend(this.opt, defaultSetting, opt);
        self._init();
    };
    Tab.prototype = {
        _init: function() {
            var self = this;
            $(self.selector).each(function() {
                self._toggle($(this), 0, true);
                self.opt.loaded({
                    $ctn: $(this).find(self.opt.ctns).eq(0)
                });
            });
            self.events();
        },
        _toggle: function($this, index, isFirst, isClick) {
            var self = this;
            var $tabs = $this.find(self.opt.tabs);
            var $tab = $tabs.eq(index);
            var $ctns = $this.find(self.opt.ctns);
            var $ctn = $ctns.eq(index);
            var $span = $tab.find('span');
            var $line = $this.find(self.opt.line);
            var width = $span.width();
            var left = $span.position().left;
            var $tabInner = $this.find(self.opt.tabInner);
            if (isFirst) {
                $ctns.filter(function(i, v) {
                    $(this).attr('data-id', self.selector.replace(/[\#|\.]/, '') + 'jPage' + i);
                });
            } else {
                $this.find(self.opt.line).addClass('_animation-all');
                $tab.addClass('_animation-all');
            }
            $tabs.removeClass(self.opt.hoverClass);
            $tab.addClass(self.opt.hoverClass);
            $line.width(width).css('left', left);
            if (isClick) {
                $ctns.hide().eq(index).show();
                window.scrollTo(0, 0);
            }
        },
        events: function() {
            var self = this;
            self.o = $(self.selector);
            self.o.find(self.opt.tabs).click(function() {
                var $this = $(this);
                var $wrap = $(this).closest(self.selector);
                var index = $wrap.find(self.opt.tabs).index($(this));
                self._toggle($wrap, index, false, true);
                self.emit('tabClick', {
                    $ctn: $wrap.find(self.opt.ctns).eq(index)
                });
            });
        }
    }
    Emitter.applyTo(Tab);
    module.exports = Tab;
});
