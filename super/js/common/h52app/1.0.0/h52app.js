/**
 * @file h52app.js
 * @synopsis  h52app
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-06-21
 */

define(function(require, exports, module) {
    'use strict';

    var jquery = require('jquery');
    var util = require('pub-lib/util/1.0.0/util');
    var cookie = require('lib/core/1.0.0/io/cookie');
    module.exports = {
        downloadUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bbg.mall',
        init: function(functionname, args) {
            var self = this;
            if (self.isFromIosOrAndroid()) {
                self.showTopPop(functionname, args);
            }
        },
        isFromIosOrAndroid: function() {
            var url = window.location.href;
            var fromPlatform = util.getHrefParam('from_app');
            var isGlobal = (window.location.hostname == 'm.yunhou.com');
            var isSuperApp = (cookie('appName') == 'superApp');
            return fromPlatform && (fromPlatform == 'android_super' || fromPlatform == 'ios_super') && !isGlobal;
        },
        showTopPop: function(functionname, args) {
            if ($('#_jH52app').length != 0) {
                return;
            }
            var self = this;
            var ar = [];
            ar.push('<div class="mod-h52app" id="_jH52app">',
                '<div class="app-icon"><img src="http://img1.bbgstatic.com/15ccea62e33_bc_91eae3ec1a3983a679efe8ccd26fad21_120x120.png"/></div>',
                '<div class="app-tips">全球精选 好而不贵</div>',
                '<div class="app-btn" id="_jOpenNow">立即打开</div>',
                '<div class="app-close" id="_jCloseAppBar"></div>',
                '</div>');
            $('body').append(ar.join('')).addClass('mod-h52app-html').addClass('mod-transparent-mask');
            $('#_jOpenNow').click(function() {
                if (!self.guidePop()) {
                    try {
                        self.open(functionname, args);
                    } catch (e) {}
                    self.toDownloadPage();
                }
            });
            $('#_jCloseAppBar').click(function() {
                self.hidePop();
            });
        },
        hidePop: function() {
            var $pop = $('#_jH52app');
            if ($pop.length != 0) {
                $pop.remove();
            }
            $('body').removeClass('mod-h52app-html');
        },
        guidePop: function() {
            var box = require('common/box/2.0.0/js/box');
            require('css!common/box/2.0.0/box.css');
            var isWeixin = function() {
                var navigator = window.navigator;
                var userAgent = navigator.userAgent;
                userAgent = userAgent.toLowerCase();
                return userAgent.match(/micromessenger/i) == 'micromessenger';
            }
            var flag = isWeixin();
            if (flag) {
                var b = box.create('<div class="icon-arrow" action-type="close"><img src="http://img1.bbgstatic.com/15cd2de646a_bc_b7163720b9518d8c96ae4cc695222d3f_488x182.png"/></div>', {
                    className: 'mod-guide-pop',
                    clickBlankToHide: true,
                    modal: true
                });
                b.show();
            }
            return flag;
        },
        open: function(functionname, args) {
            var self = this;
            var appPro = 'YHSuperApp://doAction';
            var appData = {};
            var functionname = (functionname && functionname.length != 0 ? functionname : false);
            var args = (args && args.length != 0 ? args : false); //args {json string}
            var lastUrl = '';
            if (functionname) {
                appData.functionname = functionname;
                if (args) {
                    appData.args = JSON.parse(args);
                }
                lastUrl = appPro + '?data=' + JSON.stringify(appData);
                if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                    window.location = lastUrl;
                    setTimeout(function() {
                        window.location = self.downloadUrl;
                    }, 5000);
                    // self.toDownloadPage();
                } else if (navigator.userAgent.match(/android/i)) {
                    //此操作会调起app并阻止接下来的js执行
                    $('body').append("<iframe src='" + lastUrl + "' style='display:none' target='' ></iframe>");
                    //没有安装应用会执行下面的语句
                    setTimeout(function() {
                        window.location = self.downloadUrl;
                    }, 600);
                }
            }
        },
        toDownloadPage: function() {
            var self = this;
            var downloadApp = function(url, successFun, errorFun) {
                if ($('#_jIframe').length != 0) {
                    $('#_jIframe').remove();
                }
                $('body').html('');
                $('<iframe id="_jIframe" style="position:fixed;top:0px;bottom:0px;left:0px;right:0px;height:100%;width:100%;border:0px;z-index:10001;" src="' + url + '"></iframe>').appendTo('body');
            }
            downloadApp(self.downloadUrl);

        }
    }

});
