/**
 * @file integral-homepage.js
 * @synopsis  积分商城首页
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-06-23
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie');

        //城市选择
        var cityList = function(){
                $('body').on('click', '.city-list p', function () {
                    var cityName = $(this).text(),
                        cityId = $(this).attr("data-id");
                    cookie.set("cityName",cityName,{domain: ".yunhou.com",path:"/"});
                    cookie.set("cityId",cityId,{domain: ".yunhou.com",path:"/"});
                    window.location.href = '//wx.yunhou.com/super/point/shopIndex';
                });
                $('body').on('click', '.letter a', function () {
                    var s = $(this).html();
                    $(window).scrollTop($('#' + s + '1').offset().top);
                    $("#showLetter span").html(s);
                    $("#showLetter").show(100);
                    setTimeout(hideSlow, 600);
                });
                 $('body').on('onMouse', '.showLetter span', function () {
                    $("#showLetter").show(100);
                    setTimeout(hideSlow, 600);
                });
                 function hideSlow(){
                    $("#showLetter").hide(100);
                 }
        };
        cityList();
});

