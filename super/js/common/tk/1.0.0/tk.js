/**
 * @file get-tx.js
 * @synopsis  send tx formUrl referUrl
 * @author leaytam
 * @version 1.0.0
 * @date 2017-08-17
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    
    var Tk = {
        init: function(){
            this.sendTk();
        },
        getTk: function(){
            var tk = this.getParams('tk');
            return "&tk=" + tk;
        },
        getParams: function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        sendTk: function(){
            var self = this;
            if(/\btk=[^&]+/.test(location.search)){
                var img = new Image();
                var fromUrl = encodeURIComponent(location.href);
                var referUrl = encodeURIComponent(document.referrer);
                img.src="http://super-analysis.yunhou.com/track/img?from=" + fromUrl + "&refer=" + referUrl + self.getTk();
            }
        }
    }

    module.exports = Tk;
});