/**
 * @file add-licence-plate.js
 * @synopsis  模块名称
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-09-9
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/2.0.0/js/box'),
        template = require('common/template/1.0.1/template'),
        cookie = require('common/kit/io/cookie'),
        licenseAddr = require('module/parking-payment/1.0.0/license-address'),
        searchPlate = require('text!./search-plate.tpl'),
        searchUrl = context.getConf('url.search'),
        payUrl = context.getConf('url.pay'),
        shopId = context.getConf('shopId'),
        licenseList = localStorage.getItem('licenseList') || [],
        opt;

    opt = {
        init: function () {
            this.bindEvent();
            licenseAddr.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            self.searchPlate();
            self.parkingMsg(); //点击历史车牌
            self.historyPlate(); //历史车牌
            self.licenseFocus(); //输入框为空
        },
        searchPlate: function () { //
            $('.search-btn').click(function () {
                var _this = this;
                var licenseNum = $('.jLicenseNum').val();//暂时只支持后5位模糊查询 $('.jAreaTxt').text()
                if (licenseNum.length < 3) {
                    box.error('最少输入3位~');
                    return;
                }
                //存一下

                if (localStorage.getItem('licenseList')) {
                    licenseList = JSON.parse(window.localStorage.licenseList); 
                    for (var i = 0; i < licenseList.length; i++) {
                        if(i>0 && licenseNum == licenseList[i] ){
                            console.log('1')
                            licenseList.shift();
                        }
                    }
                    licenseList.push(licenseNum);
                }
                
                if (licenseList.length > 3) {
                    licenseList.shift()
                } //显示最近3条
                localStorage.licenseList = JSON.stringify(licenseList);

                io.post(searchUrl, {
                    carNo: licenseNum
                }, function (res) {
                    //box.ok(res.msg);
                    $('.mod-history-licence ul').addClass('hide');
                    $('.jRelevance').html(template.compile(searchPlate)(res)).show();
                }, function (res) {
                    box.error(res.msg);
                }, _this)
            })
        },
        parkingMsg: function () {
            $('.jRelevance').on('click', 'li', function () {
                var carNum = $(this).text(),
                    str = payUrl.split('?').length > 1 ? '&' : '?',
                    pop = '<div class="mod-loading"><p class="loading-car-num">' + carNum + '</p><img src="//s1.bbgstatic.com/super/images/conf/park/1.0.0/loading.png" alt=""><p class="loading-msg">正在查找停车信息...</p></div>';
                if (carNum.length < 7) {
                    box.error('车牌格式不正确！')
                    return;
                }
                if (carNum == "无相关车牌信息") {
                    return;
                }
                box.fullScreen(pop, {
                    className: "ui-layer ui-full-screen ",
                    hideClose: true,
                    title: '',
                });
                window.location.href = payUrl + str + 'shopId=' + shopId + '&carNo=' + carNum;
            })
        },
        historyPlate: function () {
            console.log(licenseList)

            if (!licenseList || licenseList.length < 1) {
                return;
            }
            licenseList = JSON.parse(licenseList);
            var tpl = '';
            for (var i in licenseList) {
                var str = '<li>' + licenseList[i] + '</li>';
                tpl += str;
            }
            $('.jHistory ul').removeClass('no-plate').html(tpl);
        },
        licenseFocus: function () {
            var self = this;
            $('.jLicenseNum').bind('input propertychange', function () {
                if ($(this).val().length == 0) {
                    $('.jHistory ul').removeClass('hide');
                    $('.jRelevance').hide();
                    licenseList = localStorage.getItem('licenseList') || [];
                    self.historyPlate();
                }
            });
        }

    }
    opt.init(); //初始化
});