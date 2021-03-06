/**
 *
 * @description 分享插件
 * @author	taotao
 *
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');

    var io = require('lib/core/1.0.0/io/request');


    var Share = function() {};

    Share.prototype = {

        constructor: Share,

        defaultSetting: {
            target   : true,                        // 是否从新的页面打开
            selector : '.bdsharebuttonbox',
            addClass : '',                          // 额外添加css
            shareUrl : {
                qzone : {
                    url: '//sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url',
                    pic: 'pics',
                    title: 'title',
                    desc: 'desc',
                    summary: 'summary'
                },
                tsina : {
                    url: '//v.t.sina.com.cn/share/share.php?url',
                    pic: 'pic',
                    title: 'title',
                    desc: 'desc'
                },
                sqq : {
                    url: '//connect.qq.com/widget/shareqq/index.html?url',
                    pic: 'pics',
                    title: 'title',
                    desc: 'desc'
                },
                mqq: {
                    url: '//openmobile.qq.com/api/check?page=shareindex.html&site=%E4%BA%91%E7%8C%B4%E7%BD%91&appid=1104611146&sdkv=0&status_os=0&sdkp=0&style=9&action=shareToQQ&page_url',
                    pic: 'imageUrl',
                    title: 'title',
                    desc: 'summary'
                },
                renren : {
                    url: '//widget.renren.com/dialog/share?resourceUrl',
                    pic: 'pic',
                    title: 'title',
                    desc: 'description'
                }
            }
        },

        shareInfo: {
            url     : '',
            title   : '',
            pic     : '',
            desc    : '',
            summary : ''
        },

        init: function(opt) {
            var self = this;

            self.defaultSetting = $.extend(self.defaultSetting, opt ||{});

            //  addClass
            if (self.defaultSetting.addClass !== '') {
                $(self.defaultSetting.selector).addClass(self.defaultSetting.addClass);
            }

            self.onBeforeClick();
            self.onClick();
        },


        /**
         * set share information
         * @param	{Object} hdl
         *
         */
        setShareInfo: function(hdl) {
            var self = this;
            self.shareInfo.url     = hdl.attr('data-url') || '';
            self.shareInfo.title   = hdl.attr('data-text') || '';
            self.shareInfo.pic     = hdl.attr('data-pic') || '';
            self.shareInfo.desc    = hdl.attr('data-desc') || '';
            self.shareInfo.summary = hdl.attr('data-summary') || '';
            if (/^\/\//.test(self.shareInfo.pic)) {
                self.shareInfo.pic = 'http:' + self.shareInfo.pic;
            }
        },

        /**
         * create share link with arguments
         * @param	{String} type
         */
        createHref: function(type) {
            var self = this,
                str = '',
                FLAG = '',
                info = self.shareInfo;

            var typeKey = self.defaultSetting.shareUrl[type];


            if (info.url === '') {
                info.url = window.location.href;
            }

            for (var prop in typeKey) {
                str += FLAG + typeKey[prop] + '=' + encodeURIComponent(info[prop]);
                FLAG = '&';
            }

            if (type === 'mqq') {
                str = str + '&targetUrl=' + encodeURIComponent(info.url);
            }

            //  open in new tab or in this tab
            if (self.defaultSetting.target) {
                var a;
                if (type === 'mqq') {
                    a = $('<a class="jMQQShareBtn" style="display:none;" href="' + str + '" rel="noreferrer" target="_blank"></a>');
                    $('body').append(a);
                    a.trigger('click').remove();
                } else {
                    window.open(str, '_blank').focus();
                }

            } else {
                window.location.href = str;
            }
        },

        /**
         * executeCmd
         * @param	{String} type Description
         */
        executeCmd: function(type) {
            this.createHref(type);
        },


        /**
         * onBeforeClick
         */
        onBeforeClick: function() {
            // var self = this
            // $(self.defaultSetting.selector).mouseenter(function() {
            //     self.setShareInfo($(this));
            // });
            var $self = $(this.defaultSetting.selector)
            this.setShareInfo($self);
        },

        /**
         * onclick
         */
        onClick: function() {
            var self = this;
            $(self.defaultSetting.selector).find('a').unbind('click').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.executeCmd($(this).attr('data-cmd'), $(this));
                self.getIntegral(this);
            });
        },

        /**
        * get integral
        */
        getIntegral: function(obj){
            var gProductId,gShopId;
            if($(obj).attr('share-status') == 'true'){
                return false;
            }
            $(obj).attr('share-status', true);
            var share = $(obj).attr('data-cmd');
            var shareData = {
                'qzone': 'QQ',
                'mqq': 'QQ',
                'tsina': 'SINA'
            }
            var url = '//wx.yunhou.com/super/point/getPointByShare';
            var type = gProductId ? 'item': $PAGE_DATA && $PAGE_DATA.activityid ? 'activity' : 'common';
            var targetId = gProductId ? gProductId: $PAGE_DATA && $PAGE_DATA.activityid ? $PAGE_DATA.activityid : '';
            var source = shareData[share];
            var data = {
                type: type,
                targetId: targetId,
                url: window.location.href,
                source: source
            }
            io.jsonp(url, data, function(){
                $(obj).attr('share-status', false);
            }, function(){
                $(obj).attr('share-status', false);
            });
        }
    };

    return new Share();
});

