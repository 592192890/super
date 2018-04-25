/**
 * @file order-pickup.js
 * @synopsis  订单信息
 * @author huangzhengqian
 * @version 1.0.0
 * @date 2017-10-26
 */

define(function(require, exports, module) {
    'use strict';
    require('./utils/JsBarcode.all.min');
    require('./utils/QRCode.min');
    require('./utils/clipboard.min');
    var Clipboard = require('./utils/clipboard.min');
    var $ = require('jquery');
    var box = require('common/box/1.0.0/box');

    // 复制订单号
    var clipboard = new Clipboard('#copyOrderNum');
    clipboard.on('success', function(e) {
        box.ok("复制成功");
        e.clearSelection();
    });
    // 时间线控制
    $("#timelineCtrl").on('click', function () {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).siblings("ul").show();
            return;
        }
        $(this).addClass('active');
        $(this).siblings("ul").hide();
    });
    // 显示条码，二维码
    $("#showQrCode").on('click', function () {
        var tpl = [
            // '<div class="qrcode-box" style="width:'+ $(window).width() * 0.9 +'px;left:'+ $(window).width() * 0.05 +'px;">',
            '<div class="qrcode-box" style="width:'+ $(window).width() * 0.9 +'px;">',
            '<div class="qrcode-body">',
            '<img id="barcode" class="barcode" />',
            //'<p class="align-center">条形码编号</p>',
            '<div id="qrcode" class="qrcode"></div>',
            '<p class="align-center">请向门店工作人员展示此码</p>',
            '</div>',
            '<a class="btn" action-type="ok">知道了</a>',
            '</div>'
        ];
        var b = box.create(tpl.join(''),{
                clickBlankToHide: true, //点击空白关闭
                modal: true
            }
        );
        b.show();
        // BarCode
        try {
            JsBarcode("#barcode", "UFS563", {
                format: "CODE39",    //选择要使用的条形码类型
                width: 3,            //设置条之间的宽度
                height: 100,         //高度
                displayValue: true  //是否在条形码下方显示文字
            });
        }catch(e) {
            console.error(e)
        }
        // QRCode
        new QRCode(document.getElementById("qrcode"), {
            text: "UFS563",
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });
});