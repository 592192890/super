/**
 * @file box.js
 * @synopsis  h5端弹层
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-13
 */

define(function(require, exports, module) {
    'use strict';
    var box = require('lib/ui/box/1.0.1/box'),
        pop;

    /* --------------------------------------------------------------------------*/
    /**
     * @synopsis  createTpl 创建弹框模板
     *
     * @param obj [hideclose<是否隐藏关闭按钮>,title<标题>,ctn<内容>,btnStr<按钮str>]
     *
     * @returns [tplbox<动态生成的模板字符串>]
     */
    /* ----------------------------------------------------------------------------*/
    function createTpl(obj) {
        var tplBox = [
            '<div class="inner">',
            '<div class="pop-close icon iconfont tap-lt" action-type="close" style="display:' + (obj.hideClose ? 'none' : 'block') + ';"></div>',
            '<div class="pop-hd" style="display:' + (obj.title.length == 0 ? 'none' : 'block') + ';">' + obj.title + '</div>',
            '<div class="pop-bd jPageBody">' + obj.ctn + '</div>',
            '<div class="pop-ft">',
            obj.btnStr,
            '</div>',
            '</div>'
        ].join('');
        return tplBox;
    }
    pop = {
        alertBox: function(ctn, opt) {
            var _opt = $.extend({
                    ctn: ctn, //内容
                    className: "ui-pop",
                    clickBlankToHide: true, //点击空白关闭
                    modal: true,
                    fixed: true,
                    title: '', //标题
                    hideClose: false,
                    btnStr: '<a class="btn tap-lt" action-type="ok">' + (opt && opt.okValue || '确定') + '</a>'
                }, opt),
                layer = box.create(createTpl(_opt), _opt);
            layer.show();
            return layer;
        },
        confirmBox: function(ctn, opt) {
            var self = this,
                btnStr = '<a class="btn btn-gray tap-lt" action-type="cancel">' + (opt && opt.cancelValue || '取消') + '</a><a class="btn tap-lt" action-type="ok">' + (opt && opt.okValue || '确定') + '</a>',
                layer = self.alertBox(ctn, $.extend({
                    btnStr: btnStr,
                    hideClose: true
                }, opt));
            // layer.show();
            return layer;
        },
        tips: function(ctn, opt) {
            var _opt = $.extend({
                    ctn: ctn, //内容
                    className: "ui-pop ui-pop-tips",
                    fixed: true,
                    hideClose: true,
                    title: '', //标题
                    duration: 2000, //延迟多久消失
                    hideWithAni: 'fadeOut',
                    showWithAni: 'fadeInUp'
                }, opt),
                layer = box.create(createTpl(_opt), _opt);
            layer.show();
            return layer;
        },
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
                }, opt),
                layer = box.create(createTpl(_opt), _opt);
            layer.show();
            return layer;
        },
        error: function(ctns, opt) {
            var self = this;
            ctns = '<i class="icon iconfont">&#xe609;</i>' + ctns;
            return self.tips(ctns, opt);
        },
        ok: function(ctns, opt) {
            var self = this;
            ctns = '<i class="icon iconfont">&#xe608;</i>' + ctns;
            return self.tips(ctns, opt);
        },
        warn: function(ctns, opt) {
            var self = this;
            ctns = '<i class="icon iconfont">&#xe60b;</i>' + ctns;
            return self.tips(ctns, opt);
        },
        fullScreen: function(ctns, opt) {
            function createFullBox(ctns) {
                var ar = [];
                ar.push('<div class="ui-full-screen">',
                    ctns,
                    '<div class="close icon iconfont" action-type="close"></div>',
                    '</div>');
                return ar.join('');
            }
            var _opt = $.extend({
                    ctn: ctns, //内容
                    className: "ui-full-screen",
                    fixed: true,
                    title: '', //标题
                    btnStr: '<a class="btn tap-lt" action-type="ok">' + (opt && opt.okValue || '确定') + '</a>'
                }, opt),
                layer = box.create(createFullBox(ctns), _opt);
            layer.show();
            return layer;
        }
    };
    $.extend(box, pop);
    module.exports = box;
});
