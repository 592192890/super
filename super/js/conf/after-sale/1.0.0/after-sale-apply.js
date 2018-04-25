/**
 * @file presale.js
 * @synopsis  售后列表
 * @author scott, 592192890@qq.com
 * @version 1.0.0
 * @date 2017-03-15
 *
 */

define(function(require, exports, module) {
    'use strict';

    var wx = require('common/base/jweixin-1.3.0'),
        $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        Dialog = require('common/ui/dialog/dialog'),
        context = require('lib/gallery/context/1.0.0/context'),
        template = require('common/template/1.0.1/template'),
        Box = require('common/box/1.0.0/box'),
        Uploader = require('common/widget/uploader')
        //submit form object
    var formEntity = {
        orderId: orderId,
        reverseType: '2',
        productList: []
    };

    //init,program start point
    init();



    //get goods list
    function getGoodsList() {
        var goodsEle = $("#jGoodsList").find('li');
        formEntity.productList = [];
        goodsEle.forEach(function(value) {
            formEntity.productList.push({
                productId:$(value).attr('data-id'),
                specText:$(value).find('.jComments').attr('data-spec'),
                returnNum:$(value).find('input[type="tel"]').val().trim(),
                productType:'product',
                selected:$(value).find('.jChecked').is(':checked')

            });

        });
    }

    //validate form submit,and return error message
    function isValid() {
        var result = { result: true, tip: '' };

        //validate whether select product
        var productList = formEntity.productList;
        var len = productList.length;
        var mark = 0;
        productList.forEach(function(value, index) {
            if (!value.selected) {
                mark++;
            }
        })
        if (mark == len) {
            result.result = false;
            result.tip = '请选择至少一个商品';
            return result;
        }
        //validate refund reason
        var selectReasonId = $("#jSelectReason").val();
        if (selectReasonId == "") {
            result.result = false;
            result.tip = '请选择退货理由';
            return result;
        }
        //validate description
        var desc = $('#jDescription').val().trim();
        // if (desc.length < 5) {
        //     result.result = false;
        //     result.tip = '文字描述不得少5个字';
        //     return result;
        // } else 
        if (desc.length > 300) {
            result.result = false;
            result.tip = '文字描述不得超过300个字';
            return result;
        } else {
            formEntity.reverseDisc = desc;
        }

        //validate file upload
        var imgPathList = [];
        //判断是微信小程序还是h5
        if (window.__wxjs_environment === 'miniprogram') {
            var filesImg = $('#jAddWXFile').find('img');
            for (var i = 0; i < filesImg.length; i++) {
                var url = $(filesImg[i]).attr('data-key');
                if (url != "" && url) {
                    imgPathList.push(url);
                }
            }
            if (imgPathList.length > 0) {
                formEntity.imgPathList = imgPathList;
            }
            // else{
            //     result.result=false;
            //     result.tip='请上传文件';
            //     return result;
            // }
        } else {
            var filesInput = $('#jAddFile').find('input[type="hidden"]');
            for (var i = 0; i < filesInput.length; i++) {
                var item = filesInput[i];
                var url = $(item).val();
                if (url != "" && url) {
                    imgPathList.push(url);
                }
            }
            if (imgPathList.length > 0) {
                formEntity.imgPathList = imgPathList;
            }
            // else{
            //     result.result=false;
            //     result.tip='请上传文件';
            //     return result;
            // }
        }


        return result;
    }

    //upload file 
    function uploadFile(uploadFileUrl) {
        // initialize file upload component
        Uploader($('#jFileButton'), {
            endpoint: uploadFileUrl
        });
    }

    // 微信端上传图片，移除事件
    $("body").on('click', ".icon-delete", function() {
        $(this).parents(".id-wximg").remove();
        $("#jFileWXButton").show();
        wxFileCount--;
    });
    // 返回的图片Url渲染到界面
    function renderImg(url, imageKey) {
        var str = '<div class="id-img id-wximg">' +
            '<a href="javascript:;" class="ui-button">' +
            '<img data-key="' + imageKey + '" src="' + url + '">' +
            '<i class="iconfontmod icon icon-delete wx-icon-delete">&#xe76a;</i>' +
            '</a></div>';
        wxFileCount++;
        $('#jAddWXFile').prepend(str);
        if (wxFileCount >= 5) {
            $("#jFileWXButton").hide();
        }
    }
    // 根据微信服务端返回的图片media_id拉取到本地服务器
    var loading;

    function uploadImageByMediaId(media_id) {
        io.post({
            url: "//wx.yunhou.com/super/Image/getImageKeyByMediaId",
            data: {
                MediaId: media_id
            },
            success: function(result) {
                if (result.error) {
                    Box.error(result.msg);
                    return
                }
                renderImg(result.data.url, result.data.imageKey);
                loading.hide();
                loading = null;
            },
            error: function(err) {
                Box.error(err.msg);
                loading.hide();
                loading = null;
            }
        });
    }
    // 微信SDK图片上传
    var wxFileCount = 0;

    function uploadWXFile() {
        // 点击选择手机中的图片
        wx.ready(function() {
            $('#jFileWXButton').on('click', function() {
                wx.chooseImage({
                    count: 5, // 最多可以选择的图片张数，默认9
                    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
                    success: function(res) {
                        var i = 0,
                            length = res.localIds.length;
                        if (!length) {
                            Box.error('请先使用 chooseImage 接口选择图片');
                            return;
                        }
                        if (wxFileCount + length > 5) {
                            Box.error('上传凭证最多5张');
                            return;
                        }

                        function uploadToWxServer() {
                            if (!loading) loading = Box.loading('正在上传中，请耐心等待');
                            wx.uploadImage({
                                isShowProgressTips: 0,
                                localId: res.localIds[i],
                                success: function(result) {
                                    if (!result.serverId) {
                                        Box.error('图片上传失败');
                                        loading.hide();
                                        loading = null;
                                        return
                                    }
                                    i++;
                                    if (i < length) {
                                        uploadToWxServer();
                                    }
                                    uploadImageByMediaId(result.serverId)
                                },
                                fail: function(result) {
                                    Box.error(result.errMsg);
                                    loading.hide();
                                    loading = null;
                                }
                            });
                        }
                        uploadToWxServer();
                    },
                    fail: function(err) {
                        Box.error(err.errMsg);
                    },
                    complete: function() {}
                })
            })
        });
    }
    //input number
    $('.jNumber').on('change', function() {
        var reg = /^[1-9][0-9]*$/;

        var defautNumber = $(this).attr('data-number');
        var changeNumber = $(this).val();

        if (!reg.test(changeNumber)) {
            Box.error('请输入正整数');
            $(this).val(defautNumber);
            return;
        }
        if (parseInt(changeNumber) > parseInt(defautNumber)) {
            Box.error('输入的数字不能大于默认值');
            $(this).val(defautNumber);
            return;
        }


    });
    //minus number for product
    $('.jMinus').on('click', function() {

            var defaultNumber = $(this).parent().find('input').attr('data-number');
            var currentNumber = $(this).parent().find('input').val();
            if (parseInt(currentNumber) >= 2) {
                $(this).parent().find('input').val(parseInt(currentNumber) - 1);
            }
        })
        //add number for product
    $(".jAdd").on('click', function() {

        var defaultNumber = $(this).parent().find('input').attr('data-number');
        var currentNumber = $(this).parent().find('input').val();
        if (parseInt(currentNumber) < parseInt(defaultNumber)) {
            $(this).parent().find('input').val(parseInt(currentNumber) + 1);
        }
    })

    //program start point
    function init() {
        //get api url
        var submitApplySurl = context.getConf('url.submitApplyUrl');
        var selectReasonUrl = context.getConf('url.selectReason');
        var uploadFileUrl = context.getConf('url.uploadFile');

        //判断是微信小程序还是h5
        if (window.__wxjs_environment === 'miniprogram') {
            $("#jAddWXFile").show();
            // Box.error('微信小程序333');
            io.jsonp("//wx.yunhou.com/super/api/getWeixinConfig", {
                url: window.location.href
            }, function(data) {
                var rs = data.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: rs.appId, // 必填，公众号的唯一标识
                    timestamp: rs.timestamp, // 必填，生成签名的时间戳
                    nonceStr: rs.noncestr, // 必填，生成签名的随机串
                    signature: rs.signature, // 必填，签名，见附录1
                    jsApiList: ['chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                uploadWXFile()
            });
        } else {
            $("#jAddFile").show();
            uploadFile(uploadFileUrl); //upload file
        }

        //submit action
        $("#jSubmit").on('click', function() {
            //get goods list for formEntity Object
            getGoodsList();
            var validResult = isValid();
            if (!validResult.result) {
                Box.error(validResult.tip);
            } else {

                //submit data
                io.post({
                    url: submitApplySurl,
                    data: formEntity,
                    success: function(result) {
                        if (result.error == 0) {
                            location.href = result.data.returnUrl;
                        } else {
                            Box.error(result.msg);
                        }

                    },
                    error: function(err) {
                        Box.error(err.msg);
                    }
                })

            }


        });

        $('#jSelectReason').on('change', function(e) {
            //get selected reason
            var reverseReason = $(this).find("option:selected").text();
            formEntity.reverseReason = reverseReason;
        });
        // toggle betwwen goods service and monery service
        $(".jFirstApply").on('click', function() {
            //get apply type
            formEntity.reverseType = '2';

            $(this).addClass('active');
            $('.jSecondApply').removeClass('active');
        });
        $(".jSecondApply").on('click', function() {
            //get apply type
            formEntity.reverseType = '4';

            $(this).addClass('active');
            $('.jFirstApply').removeClass('active');


        });

    }


});