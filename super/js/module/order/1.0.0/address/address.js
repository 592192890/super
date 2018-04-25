/**
 * @file address.js
 * @synopsis  地址
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-08
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/1.0.0/box'),
        com = require('module/order/1.0.0/common/common'),
        addressTpl = require('text!./address.tpl'),
        selfMentionTpl = require('text!./self-mention.tpl'),
        selfMentionPopTpl = require('text!./self-mention-pop.tpl'),
        Tab = require('common/tab/1.0.0/tab'),
        address,
        buyType,
        gAddrType1 = {};

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    //验证是否为空
    function isEmpty(value) {
        if (typeof value === 'undefined' || $.trim(value).length == 0) {
            return true;
        }
    }

    // 验证特殊字符
    function hasSpChar(val) {
        var reg = /[~#^$@%&!*'<>]/gi;
        return reg.test(val);
    }

    // {
    //     ONLY_NATIONWIDE 仅支持全国配送;
    //     ONLY_LOCAL 仅支持本地配送;
    //     ONLY_SLEF 仅支持自提;
    //     NATIONWIDE_SLEF 全国配送和自提;
    //     LOCAL_SLEF 本地配送和自提.
    // }
    address = {
        init: function() {},
        data: function(rs) {
            var data = $.extend({}, rs),
                adr = '',
                addresses = data.data.addresses;
            buyType = data.data.buyType;

            //门店配送------------------------
            data.data._selectedAddr = true;
            $.each(addresses, function(i, ad) {
                if (ad.selected) {
                    if (ad.addrType == '0' || ad.addrType == '2') {
                        adr = ad;
                    }else if (ad.addrType == '1') {
                        gAddrType1 = ad;
                    }else {
                        data.data._selectedAddr = false;
                    }
                    return false;
                }
            });
            // sessionStorage.setItem('addrType1',JSON.stringify(gAddrType1));
            // 具有到店自提资格
            if (data.data.transportType == 'ONLY_SLEF'||data.data.transportType == 'NATIONWIDE_SLEF'||data.data.transportType == 'LOCAL_SLEF') {
                // data.data._selfZt = $.extend(data.data.selfZt, {
                data.data._selfZt = $.extend(gAddrType1, {
                    deliveryType: 1,
                    selfZtCount: data.data.selfZtCount,
                    buyType: buyType
                });
                data.data._selfMetionTpl = renderTmpl(selfMentionTpl, data.data._selfZt);
                if (data.data._selfZt.name) {
                    data.data._selfMetionData = JSON.stringify(data.data._selfZt);
                }
            }
            if (adr) {
                // var areaInfo = adr['areaInfo'],
                //     areaStr = adr['area'],
                //     isZtd = adr['selectSelf'],
                //     addr = adr['addr'],
                //     selfName = adr['selfName'] || '',
                //     isOldAddr = 0;
                // selfName = isZtd ? selfName : '';
                // if (areaInfo && areaInfo.indexOf(':') > -1) {
                //     areaInfo = areaInfo.split(':')[0].replace(/[_]/g, '');
                // } else {
                //     if (areaStr && areaStr.indexOf(':') > -1) {
                //         areaInfo = areaStr.split(':')[1].replace(/\//g, '');
                //     } else {
                //         areaInfo = '';
                //     }
                // }
                // areaInfo = areaInfo + addr;

                //是否是旧地址;三级地址取areaName
                // if (adr['selected'] && adr['needEdit']) {
                //     isOldAddr = 1;
                //     areaInfo = adr['areaName'];
                // }
                // areaInfo = areaInfo + '&nbsp;&nbsp;' + selfName;
                // areaInfo = addr + '&nbsp;&nbsp;' + selfName;
                adr['_areaInfo'] = adr['areaName'] + adr['addr'];
                adr['isOldAddr'] = 0;
            }
            if (data.data.addresses && data.data.addresses.length != 0) {
                data.data._addrData = '{"transportConfigId":"","deliveryType":"2"}';
            }
            data.data._address = adr;
            //跳转url
            //本地配送未添加信息时跳转到列表页
            if(data.data.deliveryType == '1' && (data.data.transportType == 'LOCAL_SLEF' || data.data.transportType == 'ONLY_LOCAL')){
                data.data._url = context.getConf('url.addressList') + '?source=' + data._data.source + '&transportType=' + data.data.transportType;
            }else {
                if (data.data.hidad == 1) {
                    data.data._url = context.getConf('url.' + (!adr ? 'addressAdd' : 'addressList')) + '?source=' + data._data.source + '&hidad=' + data.data.hidad + '&transportType=' + data.data.transportType;
                } else {
                    data.data._url = context.getConf('url.' + (!adr ? 'addressAdd' : 'addressList')) + '?source=' + data._data.source + '&transportType=' + data.data.transportType;
                }
            }
            // 显示方式，如果返回0 是自提   1 配送(本地配送，全国配送)
            if(data.data.deliveryType == 0){
                data.data._selected = ['active', 'none'];
            }
            if(data.data.deliveryType == 1){
                data.data._selected = ['none', 'active'];
            }
            // if(data.data._selfZt&&data.data.transportType == 'NATIONWIDE_SLEF'){
            //     data.data._selected = (data.data._selectedAddr || !data.data._selfZt ? ['none', 'active'] : ['active', 'none']); //选项卡一, 选项卡二
            //     // data.data._selected = (data.data._selectedAddr || !data.data._selfZt ? ['active', 'none'] : ['none', 'active']); //选项卡一, 选项卡二
            //     //点左边->false false ["active", "none"]
            //     //点右边->true false ["none", "active"]
            // }else{
            //     if(data.data.transportType =='ONLY_SLEF'){
            //         console.log('ONLY_SLEF')
            //         data.data._selected = ['active', 'none'];
            //     }else{//ONLY_NATIONWIDE
            //         console.log('ONLY_NATIONWIDE')
            //         data.data._selected = ['none', 'active'];
            //     }
            // }

            return data.data;
        },
        //改变自提点
        _setSelfMetion: function(data) {
            var self = this;
            $('#jSelfMention').attr({
                'data-cache': JSON.stringify(data)
            }).html(renderTmpl(selfMentionTpl, data));
        },
        //保存到店自提
        _saveSelfMetion: function(data, callback) {
            com.ajax(context.getConf('url.saveSelfMetion'), (data || {}), function(rs) {
                callback && callback(rs);
            });
        },
        //验证到店自提和门店配送信息
        validate: function() {
            var flag = $('.jAddressEmpty:visible').length == 0;
            if (!flag) {
                box.error('请添加自提或配送信息');
                return false;
            } else if ($('#jAddrDiv').length != 0 && $('#jAddrDiv').attr('data-is-old') == 1) {
                box.error('由于商城系统地址升级，请重新更新地址，<br/>让配送服务更精确！');
                return false;
            }
            return true;
        },
        events: function() {
            var self = this;
            var tb = new Tab('.jTab');
            tb.on('tabClick', function(obj) {
                var b = box.loading('数据加载中...');
                // var data = JSON.parse(_d);
                // 修改deliveryType值给后台，deliveryType   0全国  1门店自提  2 本地
                // 获取data-deliverytype私有属性
                var data = {
                    deliveryType: obj.$this.attr('data-deliverytype')
                };
                self._saveSelfMetion(data, function(rs) {
                    address.emit('saveSelfMetion', rs);
                    b.hide();
                });
            });
            // 到店自提
            $('#jSelfMention').click(function() {
                var $this = $(this),
                    cacheData = $this.attr('data-cache') || '{}',
                    data = JSON.parse(cacheData);
                box.alertBox(renderTmpl(selfMentionPopTpl, data)).action({
                    ok: function() {
                        //验证
                        var name = $.trim($('#jSelfName').val()),
                            mobile = $.trim($('#jSelfMobile').val()),
                            obj;
                        if (name.length == 0) {
                            box.error('自提人姓名不能为空!');
                            return false;
                        } else if (hasSpChar(name)) {
                            box.error('自提人姓名不能包含~#^$@%&!*\'<>等字符!');
                            return false;
                        } else if (!(/^1[0-9]{10}$/g).test(mobile)) {
                            box.error('请输入正确的手机号码');
                            return false;
                        }
                        try{
                            // var addrType1 = JSON.parse(sessionStorage.getItem('addrType1'));
                            obj = {
                                shipName: name,
                                shipMobile: mobile,
                                deliveryType: 1,

                                deliveryId: gAddrType1.deliveryId,
                                shopId: gAddrType1.shopId,
                                // buyType: 'direct',
                                buyType: buyType,
                                transportConfigId: gAddrType1.transportConfigId,
                                selfId : gAddrType1.selfId
                            };
                        }catch(e){
                            console.log(e);
                            return;
                        }

                        obj = $.extend(JSON.parse(cacheData), obj);
                        if (cacheData != JSON.stringify(obj)) {
                            self._saveSelfMetion(obj, function(rs) {
                                address.emit('saveSelfMetion', rs);
                                // self._setSelfMetion(obj);
                            });
                        }
                    }
                }).on('shown', function() {
                    //ios11兼容(input出现光标错位)
                    $("body").css("position","relative")
                    $(".ui-pop").css("position","absolute")
                });
            });
        },
        getHtml: function(data) {
            return renderTmpl(addressTpl, address.data(data));
        }
    };
    Emitter.applyTo(address);
    module.exports = address;
});
