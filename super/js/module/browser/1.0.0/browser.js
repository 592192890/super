/**
 * Browser type
 * gshop move to super
 * author leaytam
 * Date 2017-05-10
 */
define(function(require, exports, module) {

    'use strict';

    return {
        isAndroid: function(){
            var agent = navigator.userAgent.toLowerCase();
            return agent.match(/android/i) == "android";
        },

        isIos: function(){
            return navigator.userAgent.indexOf('iOSGlobal') > -1;
        },

        isWeixin : function() {
            var navigator = window.navigator;
            var userAgent = navigator.userAgent;
            userAgent = userAgent.toLowerCase();
            return userAgent.match(/micromessenger/i) == 'micromessenger';
        },

        isInsideAPP: function() {
            return window.AndroidJavascriptBridge || this.getUserAgent() || this.getUrlInfo() === 'app';
        },

        getUserAgent: function() {
            return navigator.userAgent.indexOf('iOSGlobal') > -1;
        },

        getUrlInfo: function() {
            var url = location.href,
                args = url.substring( url.lastIndexOf('?') + 1 ).split('=');

            if (args.length > 1 && args[0] === 'client') {
                return args[1];
            }
        }
    };
});
