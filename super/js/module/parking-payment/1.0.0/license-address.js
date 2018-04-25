/**
 * @file plate-address.js
 * @synopsis 
 * @author zgc
 * @version 1.0.0
 * @date 2017-09-13
 */

define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        licenseAddr;

    licenseAddr = {
        init: function () {},
        bindEvent: function () {
            //选择车牌地区
            $('.jArea').click(function () {
                $('.jAreaBox').toggle();
            });
            $('.jAreaBox li').click(function () {
                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
                $('.jAreaBox .province').toggle();
                $('.jAreaBox .city').toggle();
                if ($(this).parent().is('.province')) {
                    $('.jAreaTxt').text($(this).text());
                } else {
                    $('.jAreaTxt').text($('.jAreaTxt').text() + $(this).text());
                    $('.jAreaBox').hide();
                }
            })

        },
        popBoxEvent: function () {
            $('body').on('click', '.jArea', function () {
                $('.jAreaBox').toggle();
                $('.jRelevance').hide();
                $('.jNoSearch').addClass('hide');
            });
            $('body').on('click', '.jAreaBox li', function () {
                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
                if ($(this).text() == 'WJ' || $(this).text() == '京V') {
                    $('.jAreaTxt').text($(this).text());
                    $('.jAreaBox').hide();
                    return;
                }
                $('.jAreaBox .province').toggle();
                $('.jAreaBox .city').toggle();
                if ($(this).parent().is('.province')) {
                    $('.jAreaTxt').text($(this).text());
                } else {
                    $('.jAreaTxt').text($('.jAreaTxt').text() + $(this).text());
                    $('.jAreaBox').hide();
                }
            })
            $('body').on('focus', '.jLicenseNum', function (event) {
                $('.jAreaBox').hide();
            })
        }

    }

    module.exports = licenseAddr;
})