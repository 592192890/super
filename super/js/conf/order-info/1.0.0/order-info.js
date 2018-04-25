/**
* @file order-info.js
* @synopsis  二维码以及订单信息
* @author yanghaitao, 178224406@qq.com
* @version 1.0.0
* @date 2018-01-19
*/

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
		box = require('common/box/1.0.0/box'),
		io = require('lib/core/1.0.0/io/request'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

    require('module/order-pickup/1.0.0/utils/JsBarcode.all.min');
    
    var qrcodeText = $('#jBarcode').attr('data-barcode')

    if(qrcodeText){
        JsBarcode("#jBarcode", qrcodeText, {
            format: "CODE128",   //选择要使用的条形码类型
            width: 3,            //设置条之间的宽度
            height: 110,         //高度
            displayValue: false //是否在条形码下方显示文字
        });
    }
});



