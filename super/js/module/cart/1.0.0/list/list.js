/**
 * @file list.js
 * @synopsis  列表
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-21
 */


define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        box = require('common/box/1.0.0/box'),
        util = require('common/util/1.0.0/util'),
        extend = util.extend,
        Emitter = require('lib/core/1.0.0/event/emitter'),
        context = require('lib/gallery/context/1.0.0/context'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        ChangeNum = require('common/change-num/1.0.0/change-num'), //数量增减
        cookie = require('lib/core/1.0.0/io/cookie'),
        com = require('module/cart/1.0.0/common/common'),
        delay = com.delay(), //延迟
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'),
        //模板
        listProTpl = require('text!./list-pro.tpl'), //商品列表
        listTpl = require('text!./list.tpl'), //有效商品
        listInvalidTpl = require('text!./list-invalid.tpl'), //失效商品
        changeNumTpl = require('text!./change-num.tpl'), //数量增减
        discountTpl = require('text!./discount.tpl'), //已享受优惠
        imageLazyLoader = null,
        imgPath = context.getConf('url.imgPath'), //图片路径
        imgPathCache = {}, //缓存懒加载以后的对象
        list;

    //获取商品id和数量
    function getProducts($elem) {
        var productId = [],
            quantity = [];
        if ($elem) {
            return {
                productId: $elem.attr('data-product-id'),
                quantity: $elem.find('.jQtyTxt ').val() || $elem.attr('data-quantity')
            }
        }
        $('.jProductlistTable').each(function() {
            var $chk = $(this).find('.jChkItem');
            if ($chk.prop('checked')) {
                productId.push($chk.attr('data-product-id'));
                quantity.push($(this).find('.jQtyTxt ').val() || $chk.attr('data-quantity'));
            }
        });
        return {
            productId: productId.join(','),
            quantity: quantity.join(',')
        }
    }

    //图片懒加载

    function resetImageLoader() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
            imageLazyLoader.destroy && imageLazyLoader.destroy();
            imageLazyLoader = null;
        }
        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn'
        }).on('lazyItemReady', function(elem, source, response) {
            imgPathCache[$(elem).attr('data-src')] = 'img';
        });
    }

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function isMiniProgram(){
        if(navigator.userAgent.toLowerCase().indexOf('miniprogram')!=-1){
            return true
        }else{
            return false
        }
    }

    list = {
        init: function() {
            var self = this;
            resetImageLoader();
            var changeNum = new ChangeNum('.jChangeNum');
            changeNum.on('limit', function(obj) {
                box.tips('库存有限，此商品最多只能购买' + obj.maxNum + '件');
            }).on('update', function(obj) {
                self.updateList(obj.$elem);
            }).on('delete', function(obj) {
                box.confirmBox('确认要删除这个商品吗？').action({
                    ok: function() {
                        self.del(obj.$elem);
                    }
                });
            });
            self.events();
        },
        //搜集所有商品
        _setProducts: function(ars) {
            var ar = [];
            $.each(ars, function(i, v) {
                if (v && v.length != 0) {
                    ar = ar.concat(v);
                }
            });
            return ar;
        },
        data: function(data, flagHtml, listFlag) {
            var self = this;
            data._products = []; //所有商品的集合，包括失效商品
            data._products = data._products.concat(self._setProducts([data.invalidProducts]));
            if (!data[listFlag]) {
                return data;
            }
            //
            $.each(data[listFlag], function(i1, list) {
                if (list.shopType == 2) {
                    list._shopName = '步步高超市 —' + list.shopName;
                } else {
                    list._shopName = list.shopName;
                }
                //商品列表
                $.each(list.warehouse_groups, function(i2, pkg) {
                    data._products = data._products.concat(self._setProducts([pkg.products, pkg.gifts, pkg.unableGifts, pkg.unableGroups, pkg.unablePreSale]));
                    var productsHtml = self._getListProHtml(pkg.products, flagHtml, 'products', (i1 == 0 && i2 == 0)), //普通商品
                        giftsHtml = self._getListProHtml(pkg.gifts, '赠', 'gifts'), //赠品
                        unableGiftsHtml = self._getListProHtml(pkg.unableGifts, '赠', 'unableGifts'), //不可配送赠品
                        unableGroupsHtml = self._getListProHtml(pkg.unableGroups, '', 'unableGroups'), //不可团购，失效
                        unablePreSaleHtml = self._getListProHtml(pkg.unablePreSale, '', 'unablePreSale'); //不可预售,失效
                    pkg._listProTpl = productsHtml + giftsHtml + unableGiftsHtml + unableGroupsHtml + unablePreSaleHtml;
                    //仓库级别
                    pkg._checked = self.getCheckedOrDisabled(pkg.products);
                });
                //店铺级
                list._checked = self.getCheckedOrDisabled(list.warehouse_groups);
                //优惠
                list._discountTpl = renderTmpl(discountTpl, list);
            });
            //是否全部选中
            data._checked = self.getCheckedOrDisabled(data[listFlag]);
            if (data._checked == 'disabled' || com._data._checkedProducts.length == 0) {
                data._btnStatus = 'disabled';
            }
            return data;
        },
        events: function() {
            var self = this;
            //选中店铺
            $('.jChkShop').click(function() {
                self.checkItem({
                    $children: $(this).closest('.jShop').find('.jChkItem'),
                    $this: $(this)
                });
            });
            //单个复选框
            $('.jChkItem').click(function() {
                self.checkItem({
                    $children: $(this),
                    $this: $(this)
                });
            });
            //清空失效商品
            $('#jEmptyFailPro').click(function() {
                var $this = $(this);
                box.confirmBox('确定清空失效商品么？清空后不能恢复哦！').action({
                    ok: function() {
                        com.ajax(context.getConf('url.emptyFailPro'), {}, function(data) {
                            self.emit('refreshCartModule', data);
                        }, null, $this);
                    }
                });
            });
            //单个商品删除
            $('.jDelPro').click(function() {
                var $this = $(this);
                box.confirmBox('确认要删除这个商品吗？').action({
                    ok: function() {
                        self.del($this);
                    }
                });
            });
            
            //跳转到商品详情页
            $('.bd-img,.box-title').click(function() {
                var $this = $(this);
                var url = "https:"+$this.attr('data-url')
                if(window.__wxjs_environment === 'miniprogram'|| isMiniProgram()){
                    wx.miniProgram.navigateTo({url: '/pages/web/web?url='+url})
                    return
                }
                location.href = url
            });


        },
        //更新列表(单个商品操作)
        updateList: function($elem) {
            var self = this,
                info = getProducts($elem.closest('.jProductlistTable'));
            delay(function() {
                com.ajax(context.getConf('url.update'), {
                    productId: info.productId,
                    quantity: info.quantity
                }, function(data) {
                    self.emit('refreshCartModule', data);
                });
            }, 200);
        },
        //删除
        del: function($elem) {
            var self = this;
            var info = getProducts($elem.closest('.jProductlistTable'));
            delay(function() {
                com.ajax(context.getConf('url.dels'), {
                    productIds: info.productId
                }, function(data) {
                    self.emit('refreshCartModule', data);
                });
            }, 200);
        },
        //获取数量增减html
        _getChangeNumHtml: function(item) {
            //商品不可选择或者不可配送
            if (!item.canSelected || item.quantity_disable) {
                item._changeNumClass = 'disabled';
                item._inputStr = 'disabled="disabled"';
            }
            return renderTmpl(changeNumTpl, item);
        },
        //获取商品列表html
        _getListProHtml: function(items, flagHtml, listFlag, indexFlag) {
            var self = this;
            if (!items || items.length == 0) {
                return '';
            }
            $.each(items, function(i, item) {
                var ar = [];
                //列表样式 
                if (listFlag == 'products') {
                    item._listClass = 'jProductlistTable';
                } else if (listFlag == 'unableGifts' || listFlag == 'unableGroups' || listFlag == 'unablePreSale' || listFlag == 'invalidProducts') {
                    item._listClass = 'mod-list-pro-disabled';
                }
                //chk 字符串
                item._chk = '';
                if (listFlag == 'products') {
                    if (!item.canSelected) {
                        item._checked = 'disabled';
                    } else {
                        if (item.selected) {
                            item._checked = 'checked'
                            com._data._checkedProducts.push(item);
                        }
                    }
                    item._chk = '<div class="bd-chk"><input type="checkbox" ' + item._checked + ' class="jChkItem" data-product-id="' + item.productId + '" data-quantity="' + item.quantity + '"/></div>';
                }
                if (listFlag == 'unableGroups' || listFlag == 'unablePreSale' || listFlag == 'invalidProducts') {
                    item._chk = '<div class="bd-flag">失效</div>'
                }
                item._price = item.subtotal;
                //商品小图标判断
                if (item.giftTag && item.giftTag == '赠') {
                    item._flag = '赠';
                    // item._price = item.bargainPrice;
                } else if (flagHtml) {
                    item._flag = flagHtml;
                } else if (item.bizType && item.bizType == 'group') {
                    item._flag = '团';
                } else if (item.bizType && item.bizType == 'presale') {
                    item._flag = '预';
                }
                //图片是否不加载
                item._isLoaded = false;
                if (listFlag == 'products' && indexFlag && i < 5) {
                    item._isLoaded = true;
                }
                if (imgPathCache[com.getImgByType(item.productImage, 'l1')]) {
                    item._isLoaded = true;
                }
                //mask 提示信息
                if (item.qtyTips && item.qtyTips.length != 0 && (listFlag == 'unableGifts' || listFlag == 'unableGroups' || listFlag == 'unablePreSale' || listFlag == 'invalidProducts')) {
                    item._maskTips = '<span class="img-mask">' + item.qtyTips + '</span>';
                }
                //价格
                if (listFlag == 'groups') {
                    item._price = item.bargainPrice;
                } else if (listFlag == 'invalidProducts') {
                    item._price = false;
                }
                //数量:预售或者团购 
                if (listFlag == 'products') {
                    item._quantity = self._getChangeNumHtml(item);
                } else {
                    item._quantity = '<span class="box-num jQutySpan">' + (item.quantity ? 'x' + item.quantity : '') + '</span>';
                }
                //规格
                if (item.specList) {
                    $.each(item.specList, function(i, spec) {
                        ar.push(spec.name + ':' + spec.value);
                    });
                    item._spec = ar.join(',');
                }
                //限时抢购
                if (item.promptUrl) {
                    item._timeBuy = '<a href="' + item.promptUrl + '" class="mod-time-buy tap-lt">此商品正在限时抢购<img src="https://ssl.bbgstatic.com/super/images/conf/cart/1.0.0/goto-buy.png"/></a>';
                }
            });
            return renderTmpl(listProTpl, {
                items: items,
                _isFirst: self._isFirst,
                _imgPath: imgPath
            });
        },
        //判断复选框是否 checked or disabled
        getCheckedOrDisabled: function(items) {
            var checkedAr = [],
                disabledAr = [],
                checked = '';
            $.each(items, function(i, item) {
                if (item._checked == 'checked') {
                    checkedAr.push(item._checked);
                }
                if (item._checked == 'disabled') {
                    disabledAr.push(item._checked);
                }
            });
            checked = (checkedAr.length != 0 && ((items.length - disabledAr.length) == checkedAr.length)) ? 'checked' : '';
            if (items.length == disabledAr.length) {
                checked = 'disabled';
            }
            return checked;
        },
        //选中复选框
        checkItem: function(obj) {
            var self = this,
                $chks = obj.$children.filter(':not(:disabled)');
            $chks.prop('checked', obj.$this.prop('checked'));
            self.getChkData();
        },
        //根据Ids选中复选框
        checkItemByIds: function(ids, type) {
            $(".jChkItem").prop('checked', false);
            for(var i = 0; i < ids.length; i++) {
                $(".jChkItem[data-product-id='"+ ids[i] +"']").prop('checked', true);
            }
            this.getChkData({
                cartTransportType: type
            });
        },
        //删除商品
        deleteProducts: function(obj) {
            var self = this,
                info = getProducts();
            self.judgeChecked() && box.confirmBox('确定要删除这些商品吗？').action({
                ok: function() {
                    com.ajax(context.getConf('url.dels'), {
                        productIds: info.productId
                    }, function(data) {
                        self.emit('refreshCartModule', data);
                    }, null, obj.$this);
                }
            });
        },
        //判断选中的个数
        judgeChecked: function() {
            if (com._data._checkedProducts.length == 0) {
                box.tips('请至少选择一个商品！');
                return false;
            }
            return true;
        },
        //收藏商品
        favoritesProducts: function(obj) {
            var self = this,
                info = getProducts();
            self.judgeChecked() && com.ajax(context.getConf('url.cols'), {
                productIds: info.productId
            }, function(data) {}, null, obj.$this);
        },
        //清空购物车
        emptyCart: function(obj) {
            var self = this;
            box.confirmBox('确定要清空购物车吗？清空后不能恢复哦!').action({
                ok: function() {
                    com.ajax(context.getConf('url.emptyCart'), {}, function(data) {
                        self.emit('refreshCartModule', data);
                    }, null, obj.$this);
                }
            });
        },
        //获取请求的数据
        getChkData: function(obj) {
            var self = this,
                info = getProducts(),
                data = extend({
                    productId: info.productId
                }, obj);
            delay(function() {
                com.ajax(context.getConf('url.checked'),data , function(data) {
                    self.emit('refreshCartModule', data);
                }, null);
            }, 200);
        },
        //emptyStr
        getEmptyStr: function() {
            var ar = ['<div class="ui-page-tips">',
                '<i class="tips-img"><img src="https://ssl.bbgstatic.com/super/images/common/empty/1.0.0/cart.png"></i>',
                '<p class="tips-txt">购物车快饿瘪了T.T</p>',
                '<p class="tips-detail">主人快给我挑点宝贝吧</p>',
                '<div class="tips-btn-box">',
                // '<a href="javascript:location.reload();" class="ui-btn-line">去逛逛</a>',
                (cookie('_nick') ? '' : '<a href="' + context.getConf('url.login')+'?'+ 'returnUrl=' + encodeURIComponent(context.getConf('url.page')) + '" class="ui-btn-line">登录</a>'),
                '</div>',
                '</div>'
            ];
            return ar.join('');
        },
        getHtml: function(data) {
            var self = this,
                groupsHtml = renderTmpl(listTpl, this.data(data, false, 'groups')),
                invalidProductsHtml = renderTmpl(listInvalidTpl, {
                    _html: self._getListProHtml(data.invalidProducts, '', 'invalidProducts'),
                    invalidProducts: data.invalidProducts
                }),
                allStr = '';
            if (!data._products || data._products.length == 0) {
                return self.getEmptyStr();
            }
            return groupsHtml + invalidProductsHtml;
        }
    };
    Emitter.applyTo(list);
    module.exports = list;
});
