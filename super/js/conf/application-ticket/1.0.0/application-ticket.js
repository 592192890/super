/* 
* @Author: zgc
* @Date:   2017-10-17 15:08:02
* @Last Modified by:   zgc
*/

define(function(require, exports, module) {
    'use strict'; 
    var $ = require('jquery'),
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/2.0.0/js/box'),
        io = require('common/kit/io/request'),
        cookie = require('common/kit/io/cookie'),
        riseTypeIndex = 2,
        riseTypeObj = {'1':'企业','2':'个人'},
        $jTticketNo = $('.jTticketNo'),
        $jInvoiceType = $('.jInvoiceType'),
        $jRiseName = $('.jRiseName'),
        $jRiseType = $('.jRiseType'),
        ticketNo = $jTticketNo.text(),//小票号
        opt;
    opt = {
        init : function(){
           this.initBack();
           this.bindEvent();
           this.editAddress();
           this.invoiceRiseType();
           this.submitApplicate();
           this.loadSeesion();
        },
        bindEvent : function(){
            //invoicetype 1:电子 2：纸质
            $('.jInvoiceType i').click(function(){
                var invoiceType = $('.jInvoiceType i').index($(this))+1;
                cookie.set("invoiceType",invoiceType,{domain: ".yunhou.com",path:"/"});
                $('.jInvoiceType i').removeClass('active');
                $(this).addClass('active');
                $jInvoiceType.attr('invoicetype',invoiceType);
                if(invoiceType==1){
                    $('.jReceiveAddress').hide();
                }else if(invoiceType==2){
                    $('.jReceiveAddress').show();
                }
            })
            
            //发票抬头
            $('.jInvoiceRise').click(function(){
                var riseName = $jRiseName.text();
                var tplForm = '<input type="text" class="rise-name jRiseNameIpt" value="'+ riseName +'" placeholder="请填写抬头名称" />';
                box.alert(tplForm,{
                    btnStr: '<a class="btn tap-lt" action-type="ok">确定</a>',
                    hideClose: true //是否隐藏关闭按钮
                })
                .on('shown', function() {//ios11兼容(input出现光标错位)
                    $("body").css("position","relative")
                    $(".ui-pop").css("position","absolute")
                })
                .action({
                    ok: function(){
                        //赋值
                        var riseTxt = $('.jRiseNameIpt').val();
                        if(riseTxt.length>25){
                            box.error('发票抬头长度限制25字符');
                            return false;
                        }
                        $jRiseName.text(riseTxt);
                    }
                })
            })
            if(cookie.get('isDelateBack')=='1'){//
                cookie.set('isDelateBack','0')
                window.location.reload();
            }
        },
        invoiceRiseType:function(){
            //发票抬头类型
            $('.jInvoiceRiseType').click(function(){
                var riseType = $jRiseType.attr('riseType');
                var riseTypeArr = ['',''];
                if(riseType!=0&&riseType==1){riseTypeArr[0] = 'active'}else if(riseType!=0&&riseType==2){riseTypeArr[1] = 'active'}
                var tplRiseType = '<div class="risetype-box jRisetypeBox">'+
                '<div class="enterprise"><span class="type-txt">企业</span><i class="iconfontmod icon f-r '+ riseTypeArr[0] +'"></i></div>'+
                '<div class="personal"><span class="type-txt">个人</span><i class="iconfontmod icon f-r '+ riseTypeArr[1] +'"></i></div>'+
                '</div>';
                box.alert(tplRiseType,{
                    title: '发票抬头类型',
                    btnStr: '<a class="btn tap-lt" action-type="ok">确定</a>',
                    hideClose: true //是否隐藏关闭按钮
                })
                .action({
                    ok: function(){
                        //赋值
                        $jRiseType.text(riseTypeObj[riseTypeIndex]);
                        $jRiseType.attr('risetype',riseTypeIndex);
                        // console.log(riseTypeIndex)
                        if(riseTypeIndex==1){//类型为企业
                            $('.jRiseBox').removeClass('disable');
                            $('.jInvoiceNum').removeClass('disable');
                            $('.attention').removeClass('disable');
                        }else if(riseTypeIndex==2){//抬头类型为个人
                            $('.jRiseBox').addClass('disable');
                            $('.jInvoiceNum').addClass('disable');
                            $('.attention').addClass('disable');
                        }
                    }
                });
            })
            $('body').on('click','.jRisetypeBox i',function(){
                $('.jRisetypeBox i').removeClass('active');
                $(this).addClass('active');
                riseTypeIndex = $('.jRisetypeBox i').index($(this))+1;
                // console.log(riseTypeIndex)
            })
        },
        //填地址
        editAddress:function(){
            $('.jHasAddress').click(function(){
                var obj = {
                    rise : $jRiseName.text(),
                    iType : parseInt($jRiseType.attr('risetype')),//1企业2个人
                    iTxt : $jRiseType.text(),
                    TFN : $('.jRevenueNum').val(),//验证税号长度20
                    remark : $('.jRemark').val()//备注
                }
                sessionStorage.setItem(ticketNo, JSON.stringify(obj));
                window.location.replace( context.getConf('url.invoice') );//编辑地址
            })
        },
        loadSeesion:function(){
            if (sessionStorage.getItem(ticketNo)) {
                var sessionData = JSON.parse(sessionStorage.getItem(ticketNo)); 
                riseTypeIndex=sessionData.iType;
                $jRiseName.text(sessionData.rise);
                $jRiseType.text(sessionData.iTxt);
                $jRiseType.attr('risetype',sessionData.iType);
                $('.jRevenueNum').val(sessionData.TFN);
                $('.jRemark').val(sessionData.remark);
                if(sessionData.iType==1){//类型为企业
                    $('.jInvoiceNum').removeClass('disable');
                    $('.jRiseBox').removeClass('disable');
                }
                if(sessionData.iType==2){//类型为个人
                    $('.jInvoiceNum').addClass('disable');
                    $('.jRiseBox').addClass('disable');
                }
            }
        },
        param: {  
            isRun: false, //防止微信返回立即执行popstate事件  
        },
        backToList:function(){
            var self = this; 
            var backUrl = window.top.document.referrer;
            if(backUrl && backUrl.indexOf(context.getConf('url.invoice').split('_')[0]) < 0 && backUrl!=location.href){
                sessionStorage.setItem('backUrl', backUrl);
            }
            backUrl = sessionStorage.getItem('backUrl');
            var state = {  
                title: "title",  
                url: "#"  
            };  
            window.history.pushState(state, "title", "");
            window.addEventListener("popstate", function(e) {
                if (!self.param.isRun) {return}
                cookie.set("invoiceType",'1',{domain: ".yunhou.com",path:"/"});//默认置为电子
                sessionStorage.removeItem(ticketNo);//清掉缓存
                window.location.replace(backUrl);      
            },false);
        },
        initBack: function () {
            var self = this; 
            self.param.isRun = false;  
            setTimeout(function () { self.param.isRun = true; }, 1000); //延迟1秒 防止微信返回立即执行popstate事件  
            self.backToList();   
        },
        submitApplicate:function(){
            $('.jSubmit').click(function(){
                var _invoiceType = parseInt($jRiseType.attr('risetype')),//1企业2个人
                    data = {};
                data.invoiceType = $jInvoiceType.attr('invoiceType');//发票类型 1:电子发票,2:纸质发票
                 
                data.ticketNo = $jTticketNo.text();//小票号           
                data.invoiceTitleType = riseTypeObj[_invoiceType];//发票抬头类型       
                data.remark = $('.jRemark').val();//备注
                data.carrieCd = context.getConf('carrieCd');//小票门店编码
                data.posNum = context.getConf('posNum');//小票pos机号
                if(!_invoiceType||_invoiceType==0){
                    box.error('请选择发票抬头类型！');return;
                }
                if(data.invoiceType == 2){//发票类型为纸质发票时,收货信息必填
                    if($('.jHasAddress')){
                        data.name = $('.jName').text();
                        data.mobile = $('.jTel').text();
                        data.address = $('.jAddress').text();
                    }else{
                        box.error('请输入发票寄送信息！');return;
                    }
                }
                if(_invoiceType==1){//发票抬头类型为企业
                    if($jRiseName.text()){
                        data.invoiceTitle = $jRiseName.text();//发票抬头
                    }else{
                        box.error('请输入发票抬头！');return;
                    }
                    if($('.jRevenueNum').val()){
                        data.taxIdNum = $('.jRevenueNum').val();//税号
                    }else{
                        box.error('请输入企业税号！');return;
                    }  
                }
                sessionStorage.removeItem(ticketNo);//清掉缓存
                io.post(context.getConf('url.submitInvoice'),data, function(res) {
                    //成功回调
                    cookie.set("invoiceType",null,{domain: ".yunhou.com",path:"/"});
                    box.ok(res.msg);
                    window.location.href = context.getConf('url.billingInfo') + '?id=' + res.data.id;
                },function(res){
                    //失败回调
                    box.error(res.msg);
                });
            })
        }
    }
     opt.init();//初始化
})
