/**
 * 个人中心 - 本地自提地址
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var box = require('lib/ui/box/1.0.1/box');
    var validator = require('common/widget/valid/validator');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');
    var context = require('lib/gallery/context/1.0.0/context');
    require('common/widget/happy/happy');

    //获取url参数值
    var getUrlValue = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    };

    var type = {
        normal: 'order',
        direct: 'buy-at-once'
    };

    var $zone = $("#zone");
    var zoneHidden = {
        address: $zone.val(),
        latLng: {
            lat: $zone.attr("data-latitude"),
            lng: $zone.attr("data-longitude")
        }
    };
    var _detailAddress;
    // __r 来源自搜索页，读取cookie里面的地址
    // if(getUrlValue("__r") ) {
    //     _detailAddress = JSON.parse(cookie.get('_detailAddress') || '{}');
    // }else if(zoneHidden.address){
    //     _detailAddress = zoneHidden;
    // }

    if(getUrlValue("__r")){
        _detailAddress = JSON.parse(cookie.get('_detailAddress') || '{}');
    }else if(zoneHidden.address){
        _detailAddress = zoneHidden;
    }else {
        _detailAddress = JSON.parse(cookie.get('_detailAddress') || '{}');
    }
 
    var fields = {
        '#zone': {
            required: 'sometimes',
            test: function() {
                // var address = $('#jMapBtn input').attr("data-linkage-tab");
                var address = _detailAddress.address;
                if (!address) {
                    Dialog.tips('请选择收货地区');
                    return false;
                } else {
                    $zone.val(address);
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
        }
    };
    var $jMapBtn = $("#jMapBtn");
    var $jMapBtnInput = $jMapBtn.children("input");
    if(_detailAddress.address) {
        $jMapBtnInput.val(_detailAddress.address);
    // 来源自编辑页，读取attr数据
    } else if($jMapBtnInput.attr("data-linkage-tab")) {
        $jMapBtnInput.val($jMapBtnInput.attr("data-linkage-tab"));
    }
    $jMapBtn.click(function() {
        window.location.href = window.location.href = context.getConf('url.addressSearch');
    });

    //  表单验证
    var jFrome = $('#addressFormLocal');
    jFrome.isHappy({
        fields: fields,
        submitButton: '#submitBtnLocal',
        happy: function() {
            var loading = box.loading('正在提交...');
            var source = getUrlValue('source');
            var data = {
                latitude: _detailAddress.latLng.lat,
                longitude: _detailAddress.latLng.lng,
                source: source,
                transportType: getUrlValue('transportType'),
                addrType: '2'
            };
            if(getUrlValue('id')) {
                data.id = getUrlValue('id');
            }
            var param = jFrome.serialize();
            io.post(jFrome.attr('action'), $.param(data)+ '&' + param, function(e) {
                loading.hide();
                // hide加载框后页面跳转，导致节点不会立即消失
                // 删除DOM节点，防止点击头部返回后显示加载框
                loading.mask.remove();
                loading.node.remove();
                if (source == 'normal' || source == 'direct') {
                    var sdata = {
                        addrId: $("#hdf_addressId").val() || e.data.addrId,
                        buyType: source
                    };
                    io.jsonp(context.getConf('url.selectAddr'), sdata, function() {
                        window.location.href = context.getConf('url.order') + type[source] + '.html';
                    }, function(e) {
                        Dialog.tips(e.msg);
                    });
                // add by taotao
                } else if (source === 'seckill') {
                    window.location.href = cookie('_bbgReferer') || context.getConf('url.index');
                // add by Andrew
                }else if (source === 'points') {
                    window.location.href = context.getConf('url.points_url');
                }
                 else {
                    window.location.href = context.getConf('url.addressList');
                }
            }, function(e) {
                loading.hide();
                Dialog.tips(e.msg || '提交失败，请稍后重试');
            });
        }
    });
});
