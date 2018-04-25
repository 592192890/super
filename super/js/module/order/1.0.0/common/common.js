/**
 * @file common.js
 * @synopsis  结算公用模板
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-09
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'), //io.jsonp
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        template = require('common/template/1.0.1/template'), //模板
        box = require('common/box/1.0.0/box'),
        context = require('lib/gallery/context/1.0.0/context'),
        com;
    //扩展删除多余的html标签
    template.helper('delHtmlTag', function(str) {
        return str ? str.replace(/<[^>]+>/g, "") : '';
    });
    //转换成数值
    template.helper('Number', function(str) {
        return Number(str);
    });
    //获取图片类型
    template.helper('getImgByType', function(src, type) {
        var obj = {
            s1: 's1',
            s2: 's2',
            m1: 'm1',
            l1: 'l1',
            l2: 'l2'
        };
        type = obj[type];
        return getImgByType(src, type);
    });

    function isEmptyObject(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };

    //获取地址栏参数

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    function hasStr(str) {
        var sce = getUrlParam('source') || location.href;
        return sce.indexOf(str) > -1;
    }

    function getImgByType(src, type) {
        var self = this;
        var reg = /[!]((s1)|(s2)|(m1)|(l1)|(l2))$/
            // 有后缀就替换，无后缀就添上;
        if (isPicUrl(src)) {
            if (reg.test(src)) {
                return src.replace(reg, '!' + type);
            } else {
                return src + '!' + type;
            }
        }
        return src;
    }

    //是否是商城图片url(ps:_md5编码_数字x数字.);
    function isPicUrl(src) {
        var reg = /[_]([0-9a-zA-Z]{32})[_][0-9]+[x][0-9]+\./;
        return reg.test(src);
    }

    //网络错误
    function networkError() {
        var ar = [];
        ar.push(
            '<div class="ui-page-tips">',
            '<i class="tips-img"><img src="https://ssl.bbgstatic.com/super/images/common/empty/1.0.0/network-error.png"/></i>',
            '<p class="tips-txt">数据加载失败...</p>',
            '<div class="tips-btn-box">',
            '<a href="javascript:location.reload();" class="ui-btn-line">刷新</a>',
            '</div>',
            '</div>'
        );
        return ar.join('');
    }

    com = {
        //获取购买类型
        _getBuyType: function() {
            //购买流程( normal原流程, direct立即购买 )
            return context.getConf('buyType');
        },
        ajax: function(url, _data, successFun, errorFun, $btn) {
            var self = this,
                str = networkError();
            if(!url) return;
            io.jsonp(url, $.extend({
                source: 'wap',
                buyType: self._getBuyType()
            }, _data), function(data) {
                if (!data) {
                    $('#jNoData').html(networkError());
                    return false;
                }
                data._data = {};
                $.extend(data._data, {
                    source: self._getBuyType()
                });
                if (data.msg) {
                    box.ok(data.msg);
                }
                successFun && successFun(data);
            }, function(data) {
                if (!data) {
                    $('#jNoData').html(str);
                    return false;
                }
                var _code = data.error;
                if (_code) {
                    if (_code < 1000) {
                        //提示登录
                        if (_code == -100) {
                            location.href = context.getConf('url.login') + '?returnUrl=' + encodeURIComponent(context.getConf('url.page'));
                        } else if (_code == 500) {
                            box.error(data.msg);
                        } else {
                            //$('#jNoData').html(str);
                        }
                    } else {
                        if (_code == '14001') {
                            location.href = context.getConf('url.cartPage');
                        } else if (_code == '15003') {
                            //旧商城地址
                        } else if (_code == '10015') {
                            box.error(data.msg).on('hidden', function() {
                                location.reload();
                            });
                        } else if (15200 < _code && _code < 15300) {
                            box.error(data.msg).on('hidden', function() {
                                location.reload();
                            });
                        } else {
                            box.error(data.msg);
                        }
                    }
                }
                $('#jNoData').html(str);
                errorFun && errorFun(data);
            }, $btn).on('error', function(res) {
                if (res.error == '1') {
                    $('#jNoData').html(str);
                }
            });
        }
    }
    module.exports = com;
});
