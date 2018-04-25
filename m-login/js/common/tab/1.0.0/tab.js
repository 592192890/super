/**
 * @file tab.js
 * @synopsis tab
 * @author licuiting, 250602615@qq.com
 * @version 1.0
 * @date 2015-08-04
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var defaultSetting = {
        'tabs': '[role=tabItem]',
        'ctns': '[role=tabPanel]',
        'hoverClass': 'active',
        trigger: false //是否触发自生切换事件
    };
    //自定义事件
    var CALL_BACK_EVENTS = ['tabClick'];

    function Tab(selector, opt) {
        var self = this;
        this.opt = {};
        this.selector = selector;
        $.extend(this.opt, defaultSetting, opt);
        self._init();
    };
    Tab.prototype = {
        constructor: Tab,
        _init: function() {
            var self = this;
            if (typeof self.selector != 'string') {
                throw 'lack of selector';
                return false;
            }
            self.o = $(self.selector);
            //
            self._events();
        },
        toggle: function($this) {
            var self = this;
            var index = self.getElems($this).index;
            var $tabs = self.getElems($this).$tabs;
            var $ctns = self.getElems($this).$ctns;
            if (self.opt.trigger) {
                $tabs.eq(index).toggleClass(self.opt.hoverClass);
                $ctns.eq(index).toggle();
            } else {
                $tabs.removeClass(self.opt.hoverClass).eq(index).addClass(self.opt.hoverClass);
                $ctns.hide().eq(index).show();
            }
        },
        getElems: function($this) {
            var self = this;
            var $wrap = $this.closest(self.selector);
            var $tabs = $wrap.find(self.opt.tabs);
            var $ctns = $wrap.find(self.opt.ctns);
            var index = $tabs.index($this);
            var $ctn = $ctns.eq(index);
            return {
                $tabs: $tabs,
                $ctns: $ctns,
                $ctn: $ctn,
                index: index
            }
        },
        _events: function() {
            var self = this;
            self.o.on('click', self.opt.tabs, function(e) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                self.toggle($(this));
                self.emit(CALL_BACK_EVENTS[0], {
                    $this: $(this),
                    e: e
                });
            });
        }
    }
    Emitter.applyTo(Tab);
    module.exports = Tab;
});
