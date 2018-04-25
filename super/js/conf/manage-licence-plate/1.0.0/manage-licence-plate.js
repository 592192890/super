/**
 * @file 
 * @synopsis  模块名称
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-09-13
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box'),
        licenseAddr = require('module/parking-payment/1.0.0/license-address'),
        shopId = context.getConf('shopId'),
        addCarUrl = context.getConf('url.addcar'),
        deleteCarUrl = context.getConf('url.deletecar'),
        $num = $('.jRemainNum'),
        maxLicense = parseInt($('.jHasLicence').attr('data-max')),
        opt;

    function getReferrer() {
        var referrer = '';
        try {
            referrer = window.top.document.referrer;
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer;
                } catch (e2) {
                    referrer = '';
                }
            }
        }
        if (referrer === '') {
            referrer = document.referrer;
        }
        return referrer;
    };

    function timestamp(url) {
        var getTimestamp = new Date().getTime();
        if (url.indexOf("&timestamp") > -1) {
            url = url.split("&timestamp")[0] + "&timestamp=" + getTimestamp;
        } else {
            if (url.indexOf("?") > -1) {
                url = url + "&timestamp=" + getTimestamp
            } else {
                url = url + "?timestamp=" + getTimestamp
            }
        }
        return url;
    }
    opt = {
        init: function () {
            this.bindEvent();
            licenseAddr.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            self.miniProgram();
            self.bindLicenceNum();
            self.toPay();
            self.deleteCarNum();
            self.goback();
        },
        bindLicenceNum: function () {
            $('.jBind').click(function () {
                var licenseNum = $('.jLicenseNum').val();
                if ($num.text() && $num.text() <= 0) {
                    box.error('最多可绑定' + maxLicense + '个车牌！');
                    return;
                }
                if (!(/^[a-zA-Z0-9]{5}|[a-zA-Z0-9]{4}[\u4e00-\u9fa5]{1}$/.test(licenseNum))) {
                    box.error('请输入正确的车牌！');
                    return;
                }
                var carNumber = $('.jAreaTxt').text() + $('.jLicenseNum').val();
                //console.log(carNumber);
                io.post(addCarUrl, {
                    carNo: carNumber.toUpperCase() //转成大写
                }, function (res) {
                    box.ok(res.msg);
                    //车牌数为0->隐藏无车牌块，显示有车牌块并插入车牌
                    $('.jHasLicence').removeClass('hide');
                    $('.jNoLicence').addClass('hide');
                    //可绑车牌数量-1
                    var tpl = '<li class="licence-plate-item clearfix"><div class="licence-plate-num f-l jLicenseTxt">' +
                        carNumber.toUpperCase() +
                        '</div><div class="handle f-l jDelete"><i class="iconfontmod icon ">&#xe78f;</i>删除</div></li>';
                    $num.text(parseInt($num.text()) - 1);
                    $('.jHasLicenceUl').append(tpl);
                }, function (res) {
                    box.error(res.msg);
                }, this)
            })
        },
        toPay: function () {
            var self = this;
            $('.jLicenseTxt').click(function () {
                if (!location.href.split('?')[1]) {
                    return;
                } //进去渠道不对，禁点
                var urlType = self.getUrlParam(location.href, 'type');
                var carNum = $(this).text();
                console.log(urlType);
                if (urlType == 'parklist') {
                    var orderUrl = context.getConf('url.pay') + '&shopId=' + shopId + '&carNo=' + carNum;
                    window.location.href = orderUrl;
                }
            })
        },
        deleteCarNum: function () {
            $('.jHasLicenceUl').on('click', '.jDelete', function () {
                var parentLi = $(this).parent('li'),
                    parentUl = $(this).parents('ul'),
                    carNum = parentLi.children('.jLicenseTxt').text();
                ////console.log(carNum)
                io.post(deleteCarUrl, {
                    carNo: carNum
                }, function (res) {
                    box.ok(res.msg);
                    parentLi.remove();
                    if (parentUl.children('li').length == 0) {
                        //车牌数为0
                        //隐藏有车牌的块显示无车牌
                        $('.jNoLicence .red').text(3);
                        $('.jNoLicence').removeClass('hide');
                        $('.jHasLicence').addClass('hide');
                    }
                    //可绑车牌数量+1
                    $num.text(parseInt($num.text()) + 1);

                }, function (res) {
                    box.error(res.msg);
                })
            })
        },
        miniProgram: function () {
            window.history.pushState(null, null, null);
            var backUrl = getReferrer();
            var bool = false;
            setTimeout(function () {
                bool = true;
            }, 1000);
            window.addEventListener("popstate", function (e) {
                if (bool) {
                    window.location.href = timestamp(backUrl);
                }
            }, false);
        },
        goback: function () {
            $('.jGoBack').click(function(){
                window.history.go(-1);
            })
        },
        getUrlParam: function (url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.split('?')[1].substr(0).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    }
    opt.init(); //初始化

});