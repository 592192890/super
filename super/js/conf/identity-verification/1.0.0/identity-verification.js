/**
 * @file identity-verification.js
 * @synopsis  身份认证
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-05-31
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/1.0.0/box');
        //弹窗显示证件选择列表
    var ShowHtmlString = function(){
        // var height = document.body.clientHeight;
        // $(".hide-all").show();
        $(".hide-all").show();
        $(".shad-contact").show(80);
        $(".hide-all").on('click', function() {
             $(".shad-contact").hide(80);
             setTimeout(function(){
                $(".hide-all").hide();
             },100);
             // $(this).hide();
        });
        $(".cancel").on('click', function() {
             $(".shad-contact").hide(80);
             setTimeout(function(){
                $(".hide-all").hide();
             },100);
             
        });
    }
    //点击列表，向input注入相应value
    $(".shad-contact .item").on('click', function() {
        var idType = $(this).text();
        var dataType = $(this).attr("data-type");
        $(".cancel").trigger('click');
        $(".jSelect").attr({
            value: idType,
            name: dataType
        });
    });
    //点击绑定选择框
    $(".jSelect").on('click', function() {
        ShowHtmlString();
        $(this).blur();
    });



    //按钮状态监控
    var monitor = function(){
        $(".identity-verification").on('input', '.idNum', function() {
            btnChangeStatus();
        });
        $(".identity-verification").on('input', '.first', function() {
            btnChangeStatus();
        });
    };
    var btnChangeStatus = function(){
        var nameVal = $(".first").val();
        var idType = $(".jSelect").val();
        var idNum = $(".idNum").val();
        if (nameVal && idType && idNum) {
                $(".button button").removeAttr("disabled").removeClass('ui-btn-line').addClass('ui-btn-primary-line');
            }else{
                $(".button button").attr('disabled', 'disabled').removeClass('ui-btn-primary-line').addClass('ui-btn-line');
            };
    };
    monitor();

    //按钮提交
    var btnLogin = function(){
        $(".identity-verification .button").on('click', 'button', function() {
            var nameVal = $(".first").val();
            var idVal = $(".jSelect").val();
            var idType = $(".jSelect").attr("name");
            var idNum = $(".idNum").val();
            if (nameVal && idVal && idNum) {
                var data = {
                    name:nameVal,
                    idType:idType,
                    idNum:idNum
                };
                var url = $(".button button").attr("data-url");
                io.post(url,data,function(res){
                    box.tips("实名认证成功！");
                    // setTimeout(window.location.href = res.data.returnUrl,3000);
                    window.location.href = res.data.returnUrl;
                },function(res){
                    box.tips(res.msg);
                    $(".first").val("");
                    $(".idNum").val("");
                    $(".button button").attr('disabled', 'disabled').removeClass('ui-btn-primary-line').addClass('ui-btn-line');
                })
            };
        });
    };
    btnLogin();
});

