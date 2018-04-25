/**
 * @file change-num.js
 * @synopsis  1.0.0
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-07-15
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    //默认参数
    var defaultSetting = {
        left: '[node-type=left]',
        leftIcon: '[node-type=left-icon]',
        input: '[node-type=input]',
        right: '[node-type=right]'
    };

    function ChangeNum(selector, opt) {
        var self = this;
        if (typeof selector != 'string') {
            throw 'lack of selector';
            return false;
        }
        this.opt = {};
        this.selector = selector;
        $.extend(this.opt, defaultSetting, opt);
        self.init();
    }
    ChangeNum.prototype = {
        init: function() {
            var self = this;
            self._o = $(self.selector);
            //设置删除按钮初始化样式
            self._o.each(function() {
                var $wrap = $(this),
                    $icon = $wrap.find('[node-type="left-icon"]'),
                    $input = $wrap.find('[node-type="input"]'),
                    val = parseInt($.trim($input.val()));
                $input.attr('data-cache', val);
                self.setIconStatus($icon, val);
            });
            self._events();
        },
        _updateInput: function($this, flag, eventItem) {
            var self = this;
            var $wrap = $this.closest(self.selector);
            if ($this.hasClass('disabled') || $wrap.hasClass('disabled')) {
                return false;
            }
            var $input = $wrap.find('[node-type="input"]');
            var $icon = $wrap.find('[node-type="left-icon"]');
            var val = parseInt($.trim($input.val()));
            var cacheVal = $input.attr('data-cache');
            var maxNum = parseInt($input.attr('data-max'));
            var reg = /(^[1-9]?$)|(^[1-9][\d]*$)/;
            if (!reg.test(val)) {
                val = 1;
            } else {
                if (flag == '-' || flag == '+') {
                    eval('val' + flag + flag);
                }
                if (val < 1) {
                    val = 1;
                    self.emit('delete', {
                        $elem: $wrap
                    });
                    return false;
                }
                if (val > maxNum) {
                    val = maxNum;
                    self.emit('limit', {
                        maxNum: maxNum
                    });
					$input.val(cacheVal);
					return false;
                }
            }
            if (val == cacheVal) {
                $input.val(val);
                return false;
            }
            $input.val(val).attr('data-cache', val);
            self.setIconStatus($icon, val);
            //
            self.emit('update', {
                $elem: $wrap
            });
            self.emit(eventItem);
        },
        //设置删除按钮状态
        setIconStatus: function($icon, val) {
            $icon.removeClass('icon-trash').removeClass('icon-delete');
            $icon.addClass(val == '1' ? 'icon-trash' : 'icon-delete');
        },
        _events: function() {
            var self = this;
            //减少
            self._o.on('click', self.opt.left, function() {
                    self._updateInput($(this), '-', 'reduce');
                })
                //改变数量
                .on('change', self.opt.input, function() {
                    self._updateInput($(this), 'input', 'change');
                })
                //增加
                .on('click', self.opt.right, function() {
                    self._updateInput($(this), '+', 'add');
                });
        }
    }
    Emitter.applyTo(ChangeNum);
    module.exports = ChangeNum;
});
