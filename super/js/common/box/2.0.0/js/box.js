/**
 * Base message box for application extends.
 *
 * @module lib/ui/box/base
 * @author Allex Wang (allex.wxn@gmail.com)
 * @modify by lilcuiting
 */
define(function(require, exports, module) {
    'use strict';

    var MessageBox = require('./messagebox');
    var util = require('lib/core/1.0.0/utils/util');
    var noop = function() {};
    var mix = util.mix;
    var extend = function(r, s) {
        var filter = function(from, to) {
            return to !== undefined && to !== null && to !== '' && !(typeof to === 'number' && isNaN(to))
        }
        return function(r, s) {
            return mix(r, s, true, true, filter);
        }
    }();
    var isNode = function(o) {
        return !!(o && o.nodeType && o.tagName)
    };
    var _guid = util.guid;
    var guid = function() {
        return _guid('__0x$')
    }

    /* --------------------------------------------------------------------------*/
    /**
     * @synopsis  createTpl 创建弹框模板
     *
     * @param obj [hideclose<是否隐藏关闭按钮>,title<标题>,ctn<内容>,btnStr<按钮str>]
     *
     * @returns [tplbox<动态生成的模板字符串>]
     */
    /* ----------------------------------------------------------------------------*/
    var createTpl = function(obj) {
        var tplBox = [
            '<div class="inner">',
            '<div class="pop-close icon iconfontcom tap-lt" action-type="close" style="display:' + (obj.hideClose ? 'none' : 'block') + ';"></div>',
            '<div class="pop-hd" style="display:' + (obj.title.length == 0 ? 'none' : 'block') + ';">' + obj.title + '</div>',
            '<div class="pop-bd jPageBody">' + obj.ctn + '</div>',
            '<div class="pop-ft">',
            obj.btnStr,
            '</div>',
            '</div>'
        ].join('');
        return tplBox;
    }

    var normalizeIBoxArgs = function(args) {
        var tmpl, options = args[1] || {};
        tmpl = args[0];
        if (tmpl) {
            // Build with customize template html structures.
            if (typeof tmpl === 'string') {
                options.html = tmpl;
            } else if (typeof tmpl === 'object') {
                options = tmpl;
            }
        }
        var className = options.skin;
        if (className) {
            options.className = className;
            delete options.skin;
        }
        return options;
    }

    var createLayer = function(tmpl, options) {
        var options = normalizeIBoxArgs([tmpl, options]);
        return new MessageBox(options);
    }

    var showBubble = function(text, options, sender) {
        // HANDLE: tips(options)
        if (typeof text === 'object') {
            sender = options;
            options = text;
            text = '';
        }
        // HANDLE: tips(text, sender)
        else if (isNode(options)) {
            sender = options;
            options = {};
        }
        // HANDLE: tips(text, 500)
        else if (typeof options === 'number') {
            options = {
                duration: options
            }
        }
        options = options || {}
        var _opt = $.extend({
            ctn: text, //内容
            className: "ui-pop ui-pop-tips",
            fixed: true,
            hideClose: true,
            title: '', //标题
            duration: 2000, //延迟多久消失
            hideWithAni: 'fadeOut',
            showWithAni: 'fadeInUp'
        }, options);
        return createLayer(createTpl(_opt), _opt).show();
    };

    /**
     * Basic message box exports.
     * @singleton
     */
    var Box = {

        /**
         * Factory method for create a generic layer instance. return a singleton
         * instance if `id` provided.
         *
         * @method create
         * @param {Object|String} options The options for dialog creates. as the
         *                      dialog template structures if a string value given.
         */
        create: createLayer,
        /**
         * Show a spinner layer for asyn process, defaults use modal overlayer.
         *
         * @param {String} text The loading text
         * @param {Object} options The mixin options to construct
         */
        loading: function(ctn, opt) {
            if (ctn.length != 0) {
                ctn = '<span class="text">' + ctn + '</span>';
            }
            var _opt = $.extend({
                // ctn: '<span class="img"><img src="http://page.com/h5-lib/images/common/loading/loading.gif"/></span>' + ctn, //内容
                ctn: '<span class="img"><img src="//ssl.bbgstatic.com/pub/img/loading/loading32x32.gif"/></span>' + ctn, //内容
                className: "ui-pop ui-pop-tips ui-pop-loading",
                modal: true,
                fixed: true,
                title: '', //标题
                hideClose: true
            }, opt);
            return createLayer(createTpl(_opt), _opt).show();
        },
        transparentMask: function(opt) {
            var _opt = $.extend({
                ctn: '',
                fixed: true,
                title: '', //标题
                // hideClose: false,
                showWithAni: 'none',
                hideWithAni: 'none'
            }, opt);
            return createLayer('<div style="position:fixed;top:0;bottom:0;left:0;right:0;"></div>', _opt).show();
        },
        fullScreen: function(ctn, opt) {
            function createFun(opt) {
                var str = !opt.hideClose ? '<div class="close icon iconfontcom tap-lt" action-type="close">&#xe607;</div>' : '';
                var ar = ['<div>' + str + opt.ctn + '</div>'];
                return ar.join('');
            }
            var _opt = $.extend({
                ctn: ctn, //内容
                className: "ui-full-screen",
                fixed: true,
                title: '', //标题
                // hideClose: false,
                showWithAni: 'upPop:fast',
                hideWithAni: 'downPop:fast'
            }, opt);
            return createLayer(createFun(_opt), _opt).show();
        },
        alert: function(ctn, opt) {
            var _opt = $.extend({
                ctn: ctn, //内容
                className: "ui-pop",
                clickBlankToHide: true, //点击空白关闭
                modal: true,
                fixed: true,
                title: '', //标题
                hideClose: false,
                btnStr: '<a class="btn tap-lt" action-type="ok">' + (opt && opt.okValue || '确定') + '</a>'
            }, opt);
            return createLayer(createTpl(_opt), _opt).show();
        },
        confirm: function(ctn, opt) {
            var self = this,
                btnStr = '<a class="btn btn-gray tap-lt" action-type="cancel">' + (opt && opt.cancelValue || '取消') + '</a><a class="btn tap-lt" action-type="ok">' + (opt && opt.okValue || '确定') + '</a>';
            return self.alert(ctn, $.extend({
                btnStr: btnStr,
                hideClose: true
            }, opt));
        },
        bottom: function(ctn, opt) {
            function createFun(opt) {
                var ar = ['<div>' + opt.ctn + '</div>'];
                return ar.join('');
            }
            var _opt = $.extend({
                ctn: ctn, //内容
                className: "ui-pop-bottom",
                clickBlankToHide: true, //点击空白关闭
                duration: 0,
                modal: true,
                fixed: true,
                title: '', //标题
                hideClose: false,
                showWithAni: 'upPop:fast',
                hideWithAni: 'downPop:fast'
            }, opt);
            return createLayer(createFun(_opt), _opt).show();
        },
        select: function(ctn, opt) {
            var self = this;

            function createList(items) {
                var ar = [];
                ar.push('<div class="ui-pop-select"><ul>');
                $.each(items, function(i, v) {
                    ar.push('<li action-type="ok" data-value="' + v.value + '" class="tap-lt">' + v.text + '</li>');
                });
                ar.push('</ul>');
                ar.push('<button class="ui-btn ui-btn-block" action-type="cancel">cancel</button>');
                ar.push('</div>');
                return ar.join('');
            }
            return self.bottom(createList(ctn), opt);
        },
        left: function(ctn, opt) {
            function createFun(opt) {
                var ar = ['<div>' + opt.ctn + '</div>'];
                return ar.join('');
            }
            var _opt = $.extend({
                ctn: ctn, //内容
                className: "ui-pop-left",
                clickBlankToHide: true, //点击空白关闭
                modal: true,
                fixed: true,
                title: '', //标题
                hideClose: false,
                showWithAni: 'leftPop:fast',
                hideWithAni: 'rightPop:fast'
            }, opt);
            return createLayer(createFun(_opt), _opt).show();
        },
        bubble: showBubble

    };

    // Aliases
    Box.tips = Box.bubble;

    // Exports some shortcut api `ok`, `info`, `warn`, `error` for rich tips with auto hide in a
    // specific duration.
    util.each(['ok', 'warn', 'error'], function(type, i) {
        Box[type] = function(text, opt, sender) {
            var obj = {
                ok: '&#xe608;',
                warn: '&#xe60b;',
                error: '&#xe609;'
            };
            var ctns = '<i class="icon iconfontcom">' + obj[type] + '</i>' + text;
            return Box.tips(ctns, opt);
        }
    });

    // Exports

    Box.get = MessageBox.get;

    // Exports api for customize default config globally
    Box.config = MessageBox.config;

    module.exports = Box;

});
