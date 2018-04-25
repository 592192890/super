/**
 * 个人中心 - 地址编辑
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {

    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    var validator = require('common/widget/valid/validator');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');
    var context = require('lib/gallery/context/1.0.0/context');
    require('common/widget/happy/happy');

    var type = $('[name=distributionType]:checked').val();

    var type = {
        normal: 'order',
        direct: 'buy-at-once'
    }

    var fields = {
        '#zone': {
            required: 'sometimes',
            test: function() {
                var address = $('#jZoneBtn input').attr("data-linkage-tab");
                  $(".mod-address-edit form #zone").val(address);
                if (!address) {
                    Dialog.tips('请选择收货地区');
                    return false;
                } else {
                    $('#zone').val(address);
                    return true;
                }
            }
        },
        '#xiangxiaddress': {
            required: 'sometimes',
            test: function() {
                var xiangxiaddress = $('#xiangxiaddress').val();
                if (xiangxiaddress == '') {
                    Dialog.tips('请输入详细地址');
                    return false;

                } else {
                    return true;
                }
            }
        },
        '#shoujihao': {
            required: 'sometimes',
            test: function() {
                var shoujihao = $('#shoujihao').val();

                if (shoujihao == '') {
                    Dialog.tips('请填写手机号');
                    return false;
                } else if (!validator['mobile'].func(shoujihao)) {
                    Dialog.tips(validator['mobile'].text);
                    return false;
                } else {
                    return true;
                }
            }
        },
        '#shouhuoren': {
            required: 'sometimes',
            test: function() {
                var username = $('#shouhuoren').val();
                if (username == '') {
                    Dialog.tips('请填写收货人');
                    return false;
                } else {
                    return true;
                }
            }
        }
    };

    // if ($('#shenfenzheng').length) {
    //     fields['#shenfenzheng'] = {
    //         test: function() {
    //             var shenfenzheng = $('#shenfenzheng').val() || "";
    //             shenfenzheng = shenfenzheng.replace("x", "X");
    //             if (shenfenzheng === '') {
    //                 Dialog.tips('请填写身份证号');
    //                 return false;

    //             } else if (!validator['isIdCardNo'].func(shenfenzheng)) {
    //                 Dialog.tips(validator['isIdCardNo'].text);
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         }
    //     };
    // }

    //  表单验证
    var jFrome = $('#addressForm');
    jFrome.isHappy({
        fields: fields,
        submitButton: '#submitBtn',
        happy: function() {

            // var shenfenzheng = $('#shenfenzheng').val(),
            var username = $('#shouhuoren').val();
            // shenfenzheng = shenfenzheng.replace("x", "X");
              // if (!validator['isIdCardNo'].func(shenfenzheng) && shenfenzheng != '') {
                // Dialog.tips('请输入正确的身份证号');
                // return false;
            // }
            Dialog.tips('正在提交');
            io.post(jFrome.attr('action'), jFrome.serialize(), function(e) {
                var source = getUrlValue('source');
                if (source == 'normal' || source == 'direct') {
                    var date = {
                        addrId: e.data.addrId,
                        buyType: ''
                    }
                    io.jsonp(context.getConf('url.selectAddr'), date, function() {
                        window.location.href = context.getConf('url.order') + type[source] + '.html';
                    }, function(e) {
                        Dialog.tips(e.msg);
                    })

                    //  add by taotao
                } else if (source === 'seckill') {
                    var url = cookie('_bbgReferer') || context.getConf('url.index');
                    window.location.href = url;

                //add by Andrew
                }else if (source === 'points') {
                    window.location.href = context.getConf('url.points_url');
                }else if(source == 'invoice'){
                    window.location.href = context.getConf('url.invoice');
                }else {
                    window.location.href = context.getConf('url.addressList');
                }
            }, function(e) {
                Dialog.tips(e.msg || '提交失败，请稍后重试');
            });
        }
    });


    $('#jZoneBtn').click(function() {
        //地址一
        linkageTab({
            //调用多级地址的对象
            linkageBox: $('#jZoneBtn input'),
            // 下拉列表隐藏域的id
            selectValInput: 'f1',
            // 只存选中的value值
            selectValId: 'f2',
            // area 存文本和id的隐藏域的id
            areaId: 'areaInfo2',
            // 存最后一个值的隐藏域的id
            lastValueId: 'f4',
            //selectedData:'湖南_长沙市_芙蓉区:43_430100000000_430102000000',
            degree: 4,
            lastChangeCallBack: function(e) {
                this.hide();
                // toggleZiti();
            },
            onClose: function() {
                // toggleZiti();
            }
        });
    });

    var toggleZiti = function(oldValue) {
        var showFlg = false;
        var checkFlg = false;
        // 有可能ajax判断是否有自提点
        // var address = $('#jZoneBtn input').attr("data-linkage-tab");
        // var regionId = address.split("_");
        // if (regionId.length > 1) {
            // var url = urls.getZTD + '?regionId=' + regionId[regionId.length - 1];
            var url = context.getConf('url.getListZtd');
            io.get(url, {}, function(e) {
                var rowData = e;
                var e = eval(e);
                //console.log('resule: ', e.error);
                //console.log('message: ', e);
                //console.log("e.data", e.data);
                if (e.data && e.data.length > 0) {
                    showFlg = true;
                    $("#zitidianSelect").html("");
                    for (var i = e.data.length - 1; i >= 0; i--) {
                        if (oldValue && oldValue == e.data[i].collUid) {
                            checkFlg = true;
                            $("#zitidianSelect").append("<option selected='selected' value=" + e.data[i].collUid + ">" + e.data[i].collName + "</option>");
                        } else {
                            $("#zitidianSelect").append("<option value=" + e.data[i].collUid + ">" + e.data[i].collName + "</option>");
                        }
                    };
                } else {
                    //console.log(e.msg, "没有自提点");
                }
                // deal(showFlg, checkFlg);
            }, function(e) {
                //console.log('unexception error');
                //console.log(e);
                Dialog.tips(e.msg || '获取自提点地址数据失败，请稍后重试');
                // deal(showFlg, checkFlg);
            }, null);
        // }

        function deal(showFlg, checkFlg) {
            if (showFlg) {
                $(".zitidian-div").show();
            } else {
                $(".zitidian-div").hide();

            }
        }
    }

    //获取url参数值
    var getUrlValue = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    $('[name=distributionType]').click(function(){
        var val = $(this).val();
        $('.jTabWrap').hide().eq(val).show();
        if(val==1){
            $('#zitidianCheckbox').attr("checked","checked");
            toggleZiti();   
        }else{
            $('#zitidianCheckbox').attr("checked",false);   
        }
    });
});
