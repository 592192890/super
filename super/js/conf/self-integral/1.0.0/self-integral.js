/**
* @file self-integral.scss
* @author yanghaitao
* @version 1.0.0
* @date 2017-12-08
*/

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var Storage = require('lib/core/1.0.0/io/storage');
    var Promise = require('lib/core/1.0.0/promise/1.0.0/promise');
    var box = require('common/box/2.0.0/js/box');
    var context = require('lib/gallery/context/1.0.0/context');
    var util = require('common/util/1.0.0/util');
    var LazyStream = require('common/lazystream/1.0.0/js/lazystream');
    var ruleTpl = require('text!module/self-integral/1.0.0/tpl/tips.tpl');
    var shopList = context.getConf('url.shopList');
    var getImageKey = context.getConf('url.getImageKey');
    var sendApply = context.getConf('url.sendApply');
    var loginUrl = context.getConf('url.login');
    var Wx = require('common/wx/1.0.0/js/wx'), wx;
    var lay = null, shopId, shopMdCode, shopName, selfIntegral;

    selfIntegral = {

        isLogin: false,

        local: null,

        init: function(){
            this.local = Storage.select('mydb', 'local')
            this.checkLogin()
            this.events()
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

        checkLogin:function(){
            var $jCurrent = $("#jCurrent")
            if(!$(".unlogin-img").length>0){
                this.isLogin = true
                shopId = $jCurrent.data("id")
                shopMdCode = $jCurrent.data("code")
                shopName = $jCurrent.data("name")
            }
        },

        events: function(){
            var self = this
            // 拍摄小票，弹出底部弹框
            $("#jShoot").on('click', function () {  

                if(!self.isLogin){
                    location.href = loginUrl + encodeURIComponent(location.href)
                    return
                }
                if(!shopId || !shopMdCode || !shopName){
                    box.error("请先选择积分门店！");
                    return
                }
                
                if(self.local.get('tips')){
                    self.chooseImage()
                    return
                }
                box.confirm(
                    ruleTpl,
                    {
                        okValue: 'OK', //确定文字修改
                        cancelValue: '下次不再提示' //取消文字修改
                    }
                ).action(
                {
                    ok: function()
                    {
                        self.chooseImage()
                    },
                    cancel: function()
                    {
                        self.local.set('tips', 'done');
                        self.chooseImage()
                    }
                });   
            });

            // 显示积分门店列表
            $("#jSelect").on('click', function(){
                if(!self.isLogin){
                    location.href = loginUrl + encodeURIComponent(location.href)
                    return
                }
                var $this = $(this);
                var $add = $(".add");
                if(!$add.is(':visible')){
                    $add.show();
                    $this.find("i").eq(1).show().siblings("i").hide()
                    $this.addClass("change-class")
                    if(lay) return
                    self.lazyStream()
                }else{
                    $add.hide();
                    $this.find("i").eq(0).show().siblings("i").hide()
                    $this.removeClass("change-class")
                }  
            })

            // 未登录的处理
            $("#jPoints").on('click', function(){
                if(!self.isLogin){
                    location.href = loginUrl + encodeURIComponent(location.href)
                    return
                }
                location.href = context.getConf('url.detail')
            })

            // 未登录的处理
            $("#jTickets").on('click', function(){
                if(!self.isLogin){
                    location.href = loginUrl + encodeURIComponent(location.href)
                    return
                }
                location.href = context.getConf('url.record')
            })

            // 选择积分门店
            $("#jChoose").on('click', function(e){
                var $jSelect = $("#jSelect")
                var $add = $(".add");
                var li = $(e.target);
                shopId = li.data("id") || 0
                shopMdCode = li.data("code") || 0
                shopName = li.text() || '';
                $(".page-view li").each(function(){
                    $(this).removeClass('active')
                })
                li.addClass('active')
                $("#jCurrent").html(shopName)
                $add.hide();
                $jSelect.find("i").eq(0).show().siblings("i").hide()
                $jSelect.removeClass("change-class")
            })
        },

        lazyStream: function(){
            lay = new LazyStream('.add', {
                plUrl: shopList,
                /* 参数传递 */
                paramFormater: function(n) {
                    var data = {};
                    data.currentPage = n;
                    data.pageSize = 2;
                    return data;
                },
                container:'.add',  // 绑定当前元素
                page: 1,
                isSkipAboveTop: true,
                errorText: '<li> 网络错误， 点击重试 </li>',
                loadingClass: '',
                loadingText: '<li>正在加载，请稍后...</li>',
                load: function(el) {
                    
                },
                noAnyMore: '<li class="loading">已经加载完全</li>'
            });    
        },

        chooseImage: function(sourceType){
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

        submitIntegral:function(imageKey){
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

    selfIntegral.init()

});

