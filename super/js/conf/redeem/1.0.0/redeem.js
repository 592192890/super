/**
 * @file redeem.js
 * @synopsis  积分兑换页
 * @author zgc, er_567@foxmail.com
 * @version 1.0.0
 **/
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        box = require('common/box/2.0.0/js/box'),
        Tab = require('common/tab/1.0.0/tab'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        backToTop = require('common/ui/nav/back2top'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        io = require('common/kit/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        changeNum = require('common/change-num/1.0.0/change-num'),
        $jQtyTxt = $('.jQtyTxt'),
        $jPrice = $('.jPrice'),
        opt;
    
    opt = {
        init : function(){
            this.lazyImg();
            this.bindEvent();
            var tb = new Tab('.jTab');//tab选项卡切换
            new backToTop();//回到顶部
            new changeNum('.jChangeNum');//数量增减
            this.freight();
        },
        lazyImg : function(){
            new Lazyload('.ui-lazy', {
                // 加载效果
                effect: 'fadeIn', 
                //data属性默认src <img data-src=""
                dataAttribute: 'src', 
                // 是否跳过隐藏图片
                skipInvisible: true,  
                //设置懒加载图片classname
                loadingClass: 'img-loading', 
                // 设置加载前占位图片
                placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' 
            });
        },
        totalPoint:function(goodsPoints){
            //value比数值小1,可以换data-cache          
            var allPoints = goodsPoints+parseInt($('.jFreight').text());
            $('.jGoodsTotal').text(goodsPoints);
            $('#jTotalPrice').text(allPoints);
        },
        //配送及自提，运费变换
        freight:function(){
            var self = this;
            $("#jBySelf").click(function() {
                var goodsPoints = parseInt($jQtyTxt.attr("data-cache"))*parseInt($jPrice.text());
                $(".jFreight").text("0");
                self.totalPoint(goodsPoints);
            });
            $("#jDelivery").click(function() {
                var goodsPoints = parseInt($jQtyTxt.attr("data-cache"))*parseInt($jPrice.text());
                var freightText = $(".jFreight").attr("data-fee");
                $(".jFreight").text(freightText);
                self.totalPoint(goodsPoints);
            });
        },
        bindEvent : function(){
            $('.jSelfTake').click(function() {
                var msg = {};
                msg.name = $('.jselfManTxt').text();
                msg.tel = $('.jselfTelTxt').text();
                var tplForm = [
                    '<p class="boxTxt"><input type="text" class="selfTake jselfManIpt" value="',
                    msg.name,
                    '" placeholder="请输入自提人姓名" /></p>',
                    '<p class=""><input type="text" class="selfTake jselTelIpt" value="',
                    msg.tel,
                    '" placeholder="请输入自提手机号码" /></p>'
                ].join('');
                box.alert(tplForm,{
                    btnStr: '<a class="btn tap-lt" action-type="ok">保存</a>',
                    hideClose: true //是否隐藏关闭按钮
                })
                .action({
                    ok: function(){
                        var selfManIptStr=$('.jselfManIpt').val();//自提人姓名
                        var selTelIptStr=$('.jselTelIpt').val();//自提人手机号码
                        var  re = /^1[34578]\d{9}$/; 
                        if(!selfManIptStr){box.error('请输入自提人姓名');return;}
                        if(!selTelIptStr){box.error('请输入自提人手机号码');return;}
                        if(selfManIptStr&&selTelIptStr.length ==11 && re.test(selTelIptStr) && selTelIptStr!=''){
                            var data = {};
                            data.name = selfManIptStr;
                            data.mobile = selTelIptStr;
                            data.addrType = 1;
                            data.addrId = $('.jAddId').val();
                            io.post(context.getConf('url.savaInfo'),data, function(res) {
                                //成功回调
                                if(res.data.data.addrId>0){$('.jAddId').val(res.data.data.addrId);}
                                $('.jselfManTxt').text(selfManIptStr);
                                $('.jselfTelTxt').text(selTelIptStr);
                                box.ok('保存成功');
                            },function(res){
                                //失败回调
                                box.error(res.msg);
                            });
                        }else{
                            box.error('请输入正确的手机号码');return;
                        }
                    }
                });
            });
            $('.num-l').click(function(e){
                var goodsPoints = (parseInt($jQtyTxt.val())-1)*parseInt($jPrice.text());
                if(goodsPoints==0){
                    return
                }
                opt.totalPoint(goodsPoints);
            });
            $('.num-r').click(function(e){
                var goodsPoints = (parseInt($jQtyTxt.val())+1)*parseInt($jPrice.text());
                if(parseInt($jQtyTxt.val()) >= parseInt($jQtyTxt.attr("data-max"))){
                    return;
                }
                opt.totalPoint(goodsPoints);
            });
            $jQtyTxt.on('change',function(){
                var goodsPoints = parseInt($jQtyTxt.val())*parseInt($jPrice.text());
                if(goodsPoints<=0 || parseInt($jQtyTxt.val()) > parseInt($jQtyTxt.attr("data-max"))){
                    if(goodsPoints>0){
                        box.error('当前最多兑换'+parseInt($jQtyTxt.attr("data-max"))+'个商品');
                    }
                    return;
                }
                opt.totalPoint(goodsPoints);
            })
            $('#jSubmit').click(function(){
                var self = this;
                box.confirm(
                '确定用积分兑换该商品?').action({
                    ok: function(){
                        //发个请求//失败回调
                        $(self).attr("disabled", true);//禁用按钮
                        var orderData = {};
                        orderData.store_id = $('.jStoreId').val();
                        orderData.gift_id = $('.jGiftId').val();
                        orderData.num = $jQtyTxt.val();
                        if($('.jSelfTake').is(':visible')){
                            //自提
                            orderData.addr_id = $('.jSelfTake .jAddId').val();
                            orderData.delivery_type = 1;
                        }else{
                            //配送
                            orderData.addr_id = $('.jSelfTakePs .jAddIdPs').val();
                            orderData.delivery_type = 2;
                        }

                        io.post(context.getConf('url.orderUrl'),orderData, function(res) {
                            //成功回调
                            box.ok('提交订单成功');
                            var timer =  setTimeout(function() {
                                //跳页面
                                window.location.href = context.getConf('url.payUrl');
                            }, 1000);
                        },function(res){
                            // if(res.error=='30' || res.error=='-400'){
                            //     //积分不够时,给强提示 bugid:7327
                            //     box.alert(res.msg,{
                            //         btnStr: '<a class="btn tap-lt" action-type="ok">我知道了</a>',
                            //         hideClose: true //是否隐藏关闭按钮
                            //     })
                            // }else{
                            //     box.error(res.msg);
                            // }
                            box.error(res.msg);
                            $(self).removeAttr('disabled');
                        });
                    },
                    cancel: function(){}
                });
            })
        }
        
    }
    opt.init();//初始化
});