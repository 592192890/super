/**
 * @file list.js
 * @synopsis  商品列表
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-09
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        Emitter = require('lib/core/1.0.0/event/emitter'),
        box = require('lib/ui/box/1.0.1/box'),
        util = require('common/util/1.0.0/util'),
        context = require('lib/gallery/context/1.0.0/context'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        Tab = require('common/tab/1.0.0/tab'),
        //模板
        listProTpl = require('text!./list-pro.tpl'), //商品列表
        listTpl = require('text!./list.tpl'), //有效商品
        invalidListTpl = require('text!./invalid-list.tpl'), //失效商品
        preSaleTpl = require('text!./pre-sale.tpl'), //预售
        totalTpl = require('text!./total.tpl'), //商品总计
        couponTpl = require('text!./coupon.tpl'), //优惠券
        discountTpl = require('text!./discount.tpl'), //已享受优惠
        selfztTpl = require('text!./selfzt.tpl'), //自提信息
        distributeTimeTpl = require('text!./distributetime.tpl'), //配送时间
        SelectScroll = require('common/select-scroll/1.0.1/select-scroll'),
        imageLazyLoader = null,
        imgPath = context.getConf('url.imgPath'), //图片路径
        list;
        require('css!common/select-scroll/1.0.1/css/select-scroll.css');
        require('css!common/box/2.0.0/box.css');
        // selectZtStore;  // 选择自提门店信息变量缓存

    // 自提时间段选择
    // 支持同一订单多个店铺的时间自提弹出框
    // selectScrollCached用来缓存店铺ID及对应的自提时间数据
    // $('.zttime')点击时获取店铺ID，并渲染对应的自提时间弹出框
    var selectScrollCached = [];
    function ztTimeAutoSelect() {
        // require(['common/select-scroll/1.0.1/select-scroll',
        //     'css!common/select-scroll/1.0.1/css/select-scroll.css',
        //     'css!common/box/2.0.0/box.css'
        // ], function(SelectScroll){
        $('.zttime').click(function() {
            var _zttimeEl = $(this);
            var id= _zttimeEl.parents(".shop-wrap").attr("data-shopid");
            var _data;
            for(var i = 0,l = selectScrollCached.length;i < l;i++) {
                if(selectScrollCached[i].id == id){
                    _data = selectScrollCached[i].data
                }
            }
            var timeplugin = new SelectScroll({
                data: _data || []
            });
            timeplugin.on('ok', function(obj) {
                var label = obj.texts.join('，');
                if(!obj.texts[0]) {
                    label = obj.texts[1];
                }
                _zttimeEl.removeClass("empty").find("label").removeClass("color-f85d5b").text(label);
                _zttimeEl.find("input").val(obj.texts.join('|'))
            });
            timeplugin.show()
        });
        // });
    }

    //图片懒加载
    function resetImageLoader() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
            imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn'
        });
    }

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }
    list = {
        init: function() {
            var tb = new Tab('.jTab2', {
                trigger: true
            });
            // 选择自提门店点击事件
            var ztUserInfo = JSON.parse($(".bd-item.active").attr("data-cache") || '{}');
            $(".selectZtStore").on('click',function () {
                if(!ztUserInfo.name || !ztUserInfo.mobile) {
                    box.error('请先添加自提人信息!');
                    return;
                }
                var buyType = $(this).attr("data-buytype");
                var shopId = $(this).attr("data-shopid");
                window.location.href='/super/delivery?buyType='+ buyType +'&shopId=' + shopId;
            });
            // 自提时间段选择
            ztTimeAutoSelect();

            // 调用图片懒加载
            resetImageLoader();
        },
        data: function(data, flagHtml, listFlag) {
            var source = data._data.source;
            var self = this;
            var groups = data.data.groups;
            var pkgs, pkg;
            var buyType = data.data.buyType;
            var preSaleTime = false;    // 显示预售自提时间

            //获取流程标示(普通 / 普通预售 / 定金预售) -----------------------
            if (groups && groups.length != 0) {
                pkgs = groups[0]['pkgs'];
                if (pkgs && pkgs.length != 0) {
                    pkg = pkgs[0];
                    //是否预售(presell是定金预售。presale是全款预售)
                    if (pkg && pkg.bizType) {
                        //定金预售(定金 尾款);
                        if (pkg.bizType == 'presell') {
                            // if (pkg.activity) {
                            //     data.data._activity = pkg.activity;
                            // }
                            data.data._isPreSale = true; //标示
                        }
                        //presale是全款预售
                        if (pkg.bizType == 'presale') {
                            data.data._isNormalPreSale = true; //标示
                        }
                        // 预售自提时间
                        if (pkg.bizType == 'presell' || pkg.bizType == 'presale') {
                            preSaleTime = true;
                            if (pkg.activity) {
                                data.data._activity = pkg.activity;
                            }
                        }
                    }
                }
            }

            // 普通商品 -------------------------------------
            // 清空时间选择缓存数组
            selectScrollCached = [];
            $.each(data.data[listFlag], function(i, list) {
                //商品合计
                if (!data.data._isPreSale) {
                    list._totalTpl = renderTmpl(totalTpl, list);
                }
                if (!data.data._isPreSale && !data.data._isNormalPreSale) {

                    // ----- 优惠券 begin ---------
                    list._coupon = {}; //优惠券对像
                    list._coupon.tips = '未使用';
                    var useCoupon = list['useCoupon'], //使用优惠券	
                        couponList = list['coupons_list'], //优惠券列表
                        qStr = '';
                    list._coupon.totalStr = (couponList && couponList.length != 0 ? '(' + couponList.length + '张可用)' : '');
                    if (useCoupon && useCoupon.type) {
                        qStr = '&type=' + useCoupon.type;
                    }
                    if (useCoupon && useCoupon.code) {
                        qStr += '&code=' + useCoupon.code;
                        list._coupon.tips = '已用1张，抵扣' + useCoupon.discount + '元';
                    }
                    list._coupon.url = context.getConf('url.useCoupon') + '?source=' + source + '&shopId=' + list.shopId + '&deliveryType=' + data.data.deliveryType + qStr;
                    list._couponTpl = renderTmpl(couponTpl, list._coupon);
                    // ----- 优惠券 end ---------

                    //优惠
                    list._discountTpl = renderTmpl(discountTpl, list);
                }
                //商品列表
                $.each(list.pkgs, function(i, pkg) {
                    pkg._listProTpl = self._getListProHtml(pkg.items, flagHtml, listFlag);
                });
                // 后台返回的deliveryType 1全国 1 本地 0门店自提
                // 全国/本地配送的时候隐藏列表中的自提内容
                // 本地配送时间，显示配送时间
                if(data.data.deliveryType == '1' && data.data.transportType == 'LOCAL_SLEF') {
                    list._distributeTimeTpl = renderTmpl(distributeTimeTpl,{});
                }
                if(data.data.deliveryType == '0') {
                    //自提
                    $.each(list.selfZt, function (i, zt) {
                        if (zt.selected) {
                            // src来源自选择自提点页面
                            zt.src = util.parseQuery(window.location.search).src;
                            // 预售自提点时间
                            if(preSaleTime) {
                                zt.preSaleTime = preSaleTime;
                                var _sendTime = new Date(data.data._activity.sendTime);
                                var _sendEndTime = new Date(data.data._activity.sendEndTime);
                                zt.sendTime = _sendTime.getFullYear() + "/" + (_sendTime.getMonth() + 1) + "/" + _sendTime.getDate();
                                zt.sendEndTime = _sendEndTime.getFullYear() + "/" + (_sendEndTime.getMonth() + 1) + "/" + _sendEndTime.getDate();
                            }
                            // 选择自提门店信息缓存，自提点击前需要判断个人信息是否存在
                            // selectZtStore = zt;
                            list._selfztTpl = renderTmpl(selfztTpl, $.extend(zt, {
                                buyType: buyType
                            }));
                        }
                    });
                }
                //自提时间选择加入缓存数组
                if(list.selfTime && list.selfTime.length) {
                    selectScrollCached.push({
                        id: list.shopId,
                        data: list.selfTime
                    })
                }
            });

            //定金预售 (阶段一,阶段二,尾款通知号)
            if (data.data._isPreSale) {
                var selfZt = data.data._selfZt;
                //提取预售尾款通知号
                if (data.data._selectedAddr && data.data._address && data.data._address.mobile != undefined) {
                    data.data._mobile = data.data._address.mobile;
                } else if (selfZt && selfZt.mobile) {
                    data.data._mobile = selfZt.mobile;
                }
                data.data._preSaleTpl = renderTmpl(preSaleTpl, data.data);
            }
            return data.data;
        },
        validate: function() {
            var $mobile = $('#jMobile');
            if ($('.jProductlistTable').length == 0) {
                box.error('当前无可结算商品，您可去首页继续逛逛！');
                return false;
            } else if ($mobile.length != 0 && !(/^1[0-9]{10}$/g).test($.trim($mobile.val()))) {
                box.error('请输入正确的尾款通知号');
                return false;
            }
            return true;
        },
        //获取商品列表html
        _getListProHtml: function(items, flagHtml, listFlag) {
            if (!items || items.length == 0) {
                return '';
            }
            $.each(items, function(i, item) {
                item._price = item.subtotal;
                //标识判断
                if (item.giftTag && item.giftTag == '赠') {
                    item._flag = '赠';
                    item._price = item.bargainPrice;
                } else if (flagHtml) {
                    item._flag = flagHtml;
                } else if (item.bizType && item.bizType == 'group') {
                    item._flag = '团';
                } else if (item.bizType && item.bizType == 'presale') {
                    item._flag = '预';
                }
                //价格
                if (listFlag == 'groups') {
                    item._price = item.bargainPrice;
                }
                //市场价
                if (!(/[1-9]/g).test(item.mktprice)) {
                    item.mktprice = false;
                }
                //数量:预售或者团购
                if (listFlag == 'unablePreSale' || listFlag == 'unableGroups') {
                    item._quantity = (item.stockName ? 'x' + item.stockName : '');
                } else if (listFlag == 'gifts') {
                    //赠品
                    item._quantity = '无库存';
                } else if (item.quantity) {
                    //正常商品
                    item._quantity = 'x' + item.quantity;
                }

                //规格
                var ar = [];
                $.each(item.specList, function(i, spec) {
                    ar.push(spec.name + ':' + spec.value);
                });
                item._spec = ar.join(',');

            });
            return renderTmpl(listProTpl, {
                items: items,
                _imgPath: imgPath,
                _listClass: (listFlag == 'groups' ? 'jProductlistTable' : '')
            });
        },
        //验证是否有商品
        _validateList: function(ar, rs) {
            var flag = false;
            $.each(ar, function(i, v) {
                if (rs[v] && rs[v].length != 0) {
                    flag = true;
                    return true;
                }
            });
            return flag;
        },
        //失效商品列表html
        _getInvalidListHtml: function(data) {
            if (data.data._isPreSale) {
                return '';
            }
            var self = this,
                rs = data.data,
                ar = ['unableItems', 'unableGifts', 'unableGroups', 'unablePreSale'], //失效商品key
                flagHtmls = [false, false, '团', '预'],
                hasInvalidList = self._validateList(ar, rs),
                html;


            //创建失效商品html
            function createHtml(ar, rs) {
                var h = '';
                $.each(ar, function(i, v) {
                    h += self._getListProHtml(rs[v], flagHtmls[i], v);
                });
                return h;
            }
            html = hasInvalidList ? renderTmpl(invalidListTpl, {
                _invalidListTpl: createHtml(ar, rs)
            }) : '';
            return html;
        },
        events: function() {},
        //获取数据
        getData: function() {
            var obj1 = {
                    presellPhone: $('#jMobile') // name : obj
                },
                obj = {};
            $.each(obj1, function(k, v) {
                if (v.length != 0) {
                    obj[k] = $.trim(v.val());
                }
            });
            return obj;
        },
        //获取普通商品列表
        _getListHtml: function(data) {
            var self = this,
                flag = this._validateList(['groups'], data.data);
            return flag ? renderTmpl(listTpl, this.data(data, false, 'groups')) : '';
        },
        getHtml: function(data) {
            var self = this,
                html = self._getListHtml(data) + self._getInvalidListHtml(data);
            return html;
        }
    };
    Emitter.applyTo(list);
    module.exports = list;
});
