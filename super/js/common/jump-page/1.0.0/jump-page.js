/**
 * @file jump-page.js
 * @synopsis  浏览器跳转app
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-05-16
 */

define(function(require, exports, module) {
    'use strict';
    var box = require('common/box/2.0.0/js/box');
    var Emitter = require('pub-lib/event/1.0.0/emitter');
    var template = require('pub-lib/template/3.0/template-simple');
    var jumpPageTpl = require('text!./jump-page.tpl');
    var util = require('pub-lib/util/1.0.0/util');
    var jumpPage = {
        isShow: function() {
            var url = window.location.href;
            var fromPlatform = util.getHrefParam('from_app');
            return $('.jJumpPage').length == 0 && fromPlatform && (fromPlatform == 'android_super' || fromPlatform == 'ios_super');
        },
        show: function() {
            var self = this;
            var b = box.create(util.renderTmpl(template, jumpPageTpl), {
                modal: true,
                fixed: true
            });
            box.transparentMask(); //create a transparent mask;
            b.show().on('shown', function() {
                jumpPage.emit('shown');
            }).on('hidden', function() {
                jumpPage.emit('hidden');
            });
        }
    };
    Emitter.applyTo(jumpPage);
    module.exports = jumpPage;
});
