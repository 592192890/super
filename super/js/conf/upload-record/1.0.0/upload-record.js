/**
* @file upload-record.js
* @synopsis  小票上传记录
* @author yanghiatao, 178224406@qq.com
* @version 1.0.0
* @date 2017-12-08
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var context = require('lib/gallery/context/1.0.0/context');
    var box = require('common/box/2.0.0/js/box');
    var io = require('lib/core/1.0.0/io/request');
    var Promise = require('lib/core/1.0.0/promise/1.0.0/promise');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var getImageKey = context.getConf('url.getImageKey');
    var sendApply = context.getConf('url.sendApply');
    var Wx = require('common/wx/1.0.0/js/wx'), wx;
    var lay = null, shopId, shopMdCode, shopName;

    var uploadRecord = {

        lay: $("#jLayer"),

        init: function(){
            this.stream()
            this.events();
        },

        events: function(){
            var self = this;
            this.lay.find("img").attr("src","//ssl.bbgstatic.com/super/images/common/loading/loading1.gif")
            $('.mod-list').on('click', '.jCheckBox', function() {
                var url = $(this).attr('data-url');
                self.lay.show();
                self.lay.find("img").attr("src",url)
            });

            $('.mod-list').on('click', '.jUpload', function() {
                shopId = $(this).data("id")
                shopMdCode = $(this).data("code")
                shopName = $(this).data("name")
                self.chooseImage()
            });

            this.lay.click(function(e){
                var current = $(e.target)
                if(current.hasClass('mask')||current.hasClass('ok')){
                    $(this).find("img").attr("src","//ssl.bbgstatic.com/super/images/common/loading/loading1.gif")
                    self.lay.hide()
                }
            });
        },

        request_get:function(url, params){
            return new Promise(function(resolve, reject){
                io.get(url, params,
                    function(res) {
                        resolve(res)
                    },
                    function (error) {
                        reject(error)
                    }
                );
            })
        },

        stream: function(){
            var lay = new LazyStream('.mod-list', {
                plUrl: context.getConf('url.pageUrl'),
                /* 参数传递 */
                paramFormater: function(n) {
                    var data = {};
                    data.currentPage = n;
                    data.pageSize = 2;
                    return data;
                },
                page: 1,
                isSkipAboveTop: true,
                errorText: '<li class="loading">网络错误，点击重试</li>',
                loadingClass: '',
                loadingText: '<li class="loading">正在加载，请稍后...</li>',
                load: function(el) {      
                },
                noAnyMore: '<li class="loading">已经加载完全</li>'
            });
        },

        chooseImage:function(sourceType){
            var self = this
            if(wx){
                wx.destroy()
                wx = null;
            }
            wx = new Wx()
            wx.chooseImage().on('updateImageSuccess', function(serverId){
                self.getImage(serverId)
            }).on('updateImageFail', function(err){
                box.error(err)
            });
        },

        getImage: function(id){
            var self = this
            this.request_get(getImageKey, {MediaId:id})
            .then(function(res){
                if(res.data){
                    self.submitIntegral(res.data.imageKey)
                }
            })
            .catch(function(err){
                box.error(err.msg);
            })
        },

        submitIntegral: function(imageKey){
            var self = this
            var params = {
                imageKey:imageKey,
                shopId:shopId,
                shopMdCode:shopMdCode,
                shopName:shopName
            }
            this.loading = box.loading('正在上传中，请耐心等待')
            this.request_get(sendApply, params)
            .then(function(rs){
                self.loading.hide()
                box.ok(rs.msg)
            })
            .catch(function(err){
                self.loading.hide()
                box.error(err.msg);
            })
        }

    }

    uploadRecord.init()

});
