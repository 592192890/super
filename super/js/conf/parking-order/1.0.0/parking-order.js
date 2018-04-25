/**
 * @file parking-order.js
 * @synopsis  模块名称
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2017-09-13
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        io = require('lib/core/1.0.0/io/request'),
        box = require('common/box/2.0.0/js/box'),
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'),
        shopId = context.getConf('shopId'),
        carNo = context.getConf('carNo'),
        opt;

    var data = {
        carNo: carNo, //'湘C22222',
        shopId: shopId, //'012018'
        couponIds: [],
        posDetails: []
    }

    opt = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            // self.initReceipt();
            // self.initCoupon();
            self.initReduction(); //初始化数据
            self.addRecsipt(); //添加小票
            self.removeRecsipt(); //移除小票
            self.pay(); //付款
            self.disableBtn(); //需缴为0禁点
            self.backToList();
        },
        addRecsipt: function () {
            var self = this;
            //输入小票号
            // $('.jAddReceipt').click(function () {
            //     var recsiptInfo = [],
            //         index = $('.jReceiptsBox li').length,
            //         str = '<input type="text" placeholder="请输入有效的消费小票号" class="add-recsipt-input jRecsiptNum"><br/><input type="text" placeholder="请输入有效的POS号" class="add-pos-input jPosNum">';
            //     box.confirm(str, {
            //         hideClose: false,
            //         className: 'ui-pop ui-recsipt-pop',
            //         title: '',
            //         cancelValue: '取消',
            //         okValue: '确定'
            //     }).action({
            //         cancel: function () {

            //         },
            //         ok: function (e) {
            //             var recsiptNum = $('.jRecsiptNum').val(),
            //                 posNum = $('.jPosNum').val(),
            //                 boleanVal = true;
            //             $('.jRecsipTxt').each(function (e, ele) {
            //                 if ($(this).text() == recsiptNum) {
            //                     box.error('该小票已被添加到小票列表~~');
            //                     boleanVal = false;
            //                     return false;
            //                 }
            //             })
            //             if (!boleanVal) {
            //                 return;
            //             } //防止小票重复
            //             var opt = {
            //                 carrierCd: shopId,
            //                 ticketNo: recsiptNum,
            //                 posNum: posNum
            //             };
            //             data.posDetails.length ? data.posDetails = JSON.parse(data.posDetails) : [];
            //             // console.log(data.posDetails)
            //             data.posDetails.push(opt);
            //             data.posDetails = JSON.stringify(data.posDetails);


            //             if (recsiptNum && posNum) { //给校验

            //                 io.post(context.getConf('url.getpay'), data, function (res) {
            //                     if (res.data.ticketDiscountDetails) {
            //                         self.renderRecsipt(res.data);
            //                     }
            //                     self.syncData(res.data);

            //                 }, function (res) {
            //                     box.error(res.msg);
            //                     data.posDetails = JSON.parse(data.posDetails);
            //                     data.posDetails.splice(data.posDetails.length - 1, 1);
            //                     data.posDetails = JSON.stringify(data.posDetails);
            //                 });
            //             } else {
            //                 box.error('请输入小票号和POS号~');
            //                 return false;
            //             }
            //         }
            //     })
            // })
        },
        removeRecsipt: function () {
            var self = this;
            $('body').on('click', '.jReceiptItem', function () {
                var useReceiptNum = 0;//使用的小票数
                data.posDetails = [];//小票详情
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');              
                }
                $('.jReceiptItem').forEach(function(item,i){
                    if($(item).hasClass('active')){
                        var itemObj = {
                            carrierCd: shopId,
                            ticketNo: $(item).parent('li').attr('data-ticketNo'),
                            posNum: $(item).parent('li').attr('data-posNum')
                        };
                        data.posDetails.push(itemObj);
                        useReceiptNum++;
                    }
                })
                if(useReceiptNum>0){
                    $('.jReceiptIcon').addClass('active');
                }else{
                    $('.jReceiptIcon').removeClass('active');
                }
                data.posDetails = JSON.stringify(data.posDetails);
                io.post(context.getConf('url.getpay'), data, function (res) {
                    // console.log('进来了')
                    //小票数据  
                    if($('.jReceiptItem').length>1){//判断大于1条
                        $('.jReceiptItem').forEach(function(item,i){
                            var _receipt = $(item).siblings('.jRecsipTxt').text();
                            res.data.ticketDiscountDetails.forEach(function (_item, index) {
                                if($(item).hasClass('active') && _receipt == _item.ticketNo){
                                    $(item).siblings('.jReceipt').text('-￥'+_item.discount)
                                }
                            })
                            
                        })
                    }
                    
                    self.syncData(res.data);
                }, function (res) {
                    box.error(res.msg);//
                });
            })
        },
        renderRecsipt:function(resData){
            var tpl = '';
            resData.ticketDiscountDetails.forEach(function (item, index) {
                tpl += '<li data-ticketNo="' + item.ticketNo + '" data-posNum="' + item.posNum +
                    '"><span class="jRecsipTxt">' + //<i class="iconfontmod icon jReceiptItem active">&#xe796;</i>
                    item.ticketNo +
                    '</span><span class="f-r jReceipt">-￥' +
                    item.discount + '</span></li>';
            })
            tpl+='<li class="total-receipt"><span>总计：</span><span class="jReceiptSum">-￥' + resData.ticketDiscount + '</span></li>';
            $('.jReceiptsBox').html(tpl);
            $('.jReceiptIcon').addClass('active');
        },
        syncData: function (resData) {
            // console.log(resData.discount)
            sessionStorage.setItem(shopId+carNo, JSON.stringify({preData: data,}));
            $('.jReceiptSum').text('-￥' + resData.ticketDiscount) //消费总减免
            var couponReduce = resData.couponDiscount; //优惠减免
            var vipReduce = resData.levelDiscount; //会员等级减免
            var totalReduce = resData.discount; //总共减免
            var needPay = resData.waitPayAmount; //需支付金额
            if (needPay <= 0) {
                $('.add-discounts').addClass('disabled');
            }else{
                $('.add-discounts').removeClass('disabled');
            }
            if(couponReduce>0){
                $('.jCouponReduce').text('-￥' + couponReduce) //优惠券减免
            }
            $('.jTotalReduce').text('￥' + totalReduce) //本次共减免金额
            $('.jNeedPay').text('￥' + needPay) //需支付金额
        },
        pay: function () {
            //确认缴费
            var self = this;
            $('.jSurePay').click(function () {
                data.payMoney = parseInt($('.jNeedPay').text().slice(1));
                if (Object.prototype.toString.call(data.couponIds) == '[object Array]') { //为数组时，转格式
                    data.couponIds = JSON.stringify(data.couponIds);
                }
                if (sessionStorage.getItem(shopId+carNo)) { //是否sessionStorage,有就取
                    data.posDetails = JSON.parse(sessionStorage.getItem(shopId+carNo)).preData.posDetails;
                    //console.log(data.posDetails)
                } else {
                    if (Object.prototype.toString.call(data.posDetails) == '[object Array]') {//判断是否为json对象数组
                        data.posDetails = JSON.stringify(data.posDetails);
                    }
                }
                //支付的时候，可能之前没有小票用了券，然后小票生成了 不需要用券 data.couponIds
                if($('.jCouponReduce').text().trim() === '请选择优惠券'){
                    data.couponIds = JSON.stringify([]);
                }
                // 判断是小程序还是H5
                wx.miniProgram.getEnv(function(rsp) {
                    if(rsp.miniprogram){ 
                        // console.log(location.href)
                        data.source='wx';
                        data.miniprogram = '1';//self.getUrlParam(location.href, 'miniprogram');
                        data.openid = self.getUrlParam(location.href, 'openid');
                     }
                })
                io.post(context.getConf('url.payorder'), data, function (res) {
                    sessionStorage.removeItem(shopId+carNo);
                    wx.miniProgram.getEnv(function(rsp) { 
                        if(rsp.miniprogram){
                            wx.miniProgram.reLaunch({url: '/pages/homepage/homepage?appSource=h5&source=forPay&merOrderNo='+res.data.merOrderNo+
                            '&payOrderNo='+res.data.payOrderNo+'&orderAmt='+res.data.waitPayAmountFen+'&title=停车缴费'});                            
                        }
                    }) 
                    if(res.data.payAction){
                        window.location.href = res.data.payAction;
                    }  
                }, function (res) {
                    if (res.error == 200) {
                        box.ok(res.msg);
                        sessionStorage.removeItem(shopId+carNo);//支付0元，也要清掉
                        setTimeout(function(){
                            window.location.reload();
                        },1000) 
                    }
                    box.error(res.msg);
                });
            })
        },
        getUrlParam: function (url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.split('?')[1].substr(0).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        initReduction: function () {
            var self = this;
            var couponNum = self.getUrlParam(location.href, 'couponIds');
            //是否有小票信息
            if (sessionStorage.getItem(shopId+carNo)) {

                if (JSON.parse(sessionStorage.getItem(shopId+carNo)).preData.carNo == data.carNo){
                    var preData = JSON.parse(sessionStorage.getItem(shopId+carNo)).preData;
                    $.extend(data, preData);
                }
               
            } else {
                data.posDetails = JSON.stringify([]);
            }
            //是否有优惠券信息
            if (couponNum) {
                data.couponIds = JSON.stringify([parseInt(couponNum)]);
                $('.jAddCoupon').addClass('active');
            } else {
                data.couponIds = JSON.stringify([]);
            }
            //请求接口，更新数据
            io.post(context.getConf('url.getpay'), data, function (res) {
                if (res.data.ticketDiscountDetails) {
                    self.renderRecsipt(res.data);
                }
                //以上可以提出来
                self.syncData(res.data);
            }, function (res) {
                sessionStorage.removeItem(shopId+carNo);//报错后删除session
                data.posDetails = JSON.stringify([]);//清掉data里的小票详情
                box.error(res.msg);
                // box.alert(res.msg); //立方无此车牌
            });
        },
        disableBtn: function () {
            var needPayMoney = parseInt($('.jNeedPay').text().slice(1));
            if (needPayMoney <= 0) {
                $('.add-discounts').addClass('disabled');
            }
        },
        backToList:function(){
            var backUrl = window.top.document.referrer;
            var locationUrl = location.href;
            if(backUrl && ($('.add-discounts a')[0].href != backUrl) && backUrl!=locationUrl){
                sessionStorage.setItem('backUrl', backUrl);
            }
            backUrl = sessionStorage.getItem('backUrl');
            window.history.pushState(null, null, null);
            window.addEventListener("popstate", function(e) {
                window.location.replace(backUrl);
                // window.history.go(-1);      
            },false);
        }
    }
    opt.init(); //初始化

});