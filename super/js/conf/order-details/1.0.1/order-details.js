/**
 * @file order-details.js
 * @synopsis  详细订单
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.1
 * @date 2017-06-01
 */

define(function(require, exports, module) {
    'use strict';

    require('module/order-pickup/1.0.0/utils/JsBarcode.all.min');
    require('module/order-pickup/1.0.0/utils/QRCode.min');
    var $ = require('jquery'),
		box = require('common/box/1.0.0/box'),
        io = require('lib/core/1.0.0/io/request'),
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'), //引入小程序对象
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
        // dialog = require('common/base/dialog');
        require('module/order-detail/1.0.0/action');
        
    var ZeroClipboard = require('module/order-detail/1.0.0/ZeroClipboard.min');
    
    // function pushHistory() {  
    //     var state = {  
    //         title: "title",  
    //         url: location.href
    //     };  
    //     window.history.pushState(state, state.title, state.url);  
    // }
    
    // pushHistory();  

    // window.addEventListener("popstate", function(e) {  //回调函数中实现需要的功能
    //     //订单详情点返回强制回到订单列表
    //     location.replace('https://wx.yunhou.com/super/member/orders');
    // }, false);

    //物流状态查询
	$(".lessAdress").each(function() {
		var li= $(this).siblings('ul').find('li');
		li.length>=2?$(this).show():$(this).hide();
	});
	$(".logistics-bd li:first").show().on('click',function() {
        $(this).siblings().show();
        $(".logistics-bd .more").addClass("moreAdress").removeClass("lessAdress");
    });;
	$(".logistics-bd .more").on('click', function(){
		$(".logistics-bd li:first").siblings().hide();
		$(this).addClass("lessAdress").removeClass("moreAdress");
	});
    //判断订单列表种类数量，种类大于1隐藏下拉展示按钮(在dom解析完成后，再判断length，需要反向绑定length)
    $(".jOrderMore").each(function() {
        var li = $(this).parents('.mod-product-des').find('li');
        var length = li.length;
        if (length > 2) {
            li.slice(0,2).addClass("flex").removeClass("product-detail");
			$(this).parents('.mod-product-des').find('li.product-detail').addClass("jhide");
            $(this).show();
            $(this).parents('.jWrapMore').show();
        }else{
            li.addClass("flex").removeClass("product-detail");
            $(this).hide();
            $(this).parents('.jWrapMore').hide();
        };
    }); 
    ////绑定订单列表展示更多功能按钮 (反向绑定li,解决模块间同名冲突)
    $(".jOrderMore").on('click', function() {
        var li = $(this).parents('.mod-product-des').find('li.jhide');
        if ($(this).attr('data-status') == 'close') {
            li.addClass("flex").removeClass("product-detail");
            $(this).addClass("open").removeClass("close");
            $(this).attr('data-status', 'open');
        } else{
			li.removeClass("flex").addClass("product-detail");
            $(this).addClass("close").removeClass("open");
            $(this).attr('data-status', 'close');
        };
    });
     //图片懒加载
    var lazy = new Lazyload('.ui-lazy', {
        effect: 'fadeIn', // 加载效果
        dataAttribute: 'src', //data属性默认src <img data-src=""
        skipInvisible: false,  // 是否跳过隐藏图片
        loadingClass: 'img-loading', //设置懒加载图片classname
        placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' // 设置加载前占位图片
   });
   
   var dlgTmpl = [
		'<div class="ui-contnt">',
			'<div class="ui-select">',
				'<select id="jCancelReason">',
					'<option class="first" checked value="">请选择取消原因</option>',
					'<option value="价格太高了">价格太高了</option>',
					'<option value="拍错了，重新拍">拍错了，重新拍</option>',
					'<option value="服务不好">服务不好</option>',
					'<option value="不想买了">不想买了</option>',
					'<option value="支付不成功">支付不成功</option>',
					'<option value="其他原因">其他原因</option>',
				'</select>',
			'</div>',
			'<div class="ui-wrop">',
				'<input id="jOtherReason" class="ui-wrop-input" placeholder="请输入其他原因" />',
			'</div>',
		'</div>'
    ].join('');
    //取消订单
   $(".wrop a[node-type='cancelBtn']").on("click",function(){
	   var orderId = $(this).parent().attr('order-id');
		box.alertBox(
			dlgTmpl,
			{
				title: '',//标题
				hideClose: false //是否隐藏关闭按钮
			}
		).action(
		{
			ok: function()
			{
				var sV = $('#jCancelReason').val(),
					sOV = $('#jOtherReason').val();
				
				if (!sV && !sOV) {
					if (!sV) {
						box.tips('请选择取消原因');
					}else {
						box.tips('清填写取消原因');
                    }
                    return;
				}
				io.jsonp(
					$('#cancel-url').val(),
					{orderId: orderId,
					reason: sV || sOV
					},
					function() {
						window.location.reload();
					},
					function (e) {
						box.tips(e.msg);
					}
				);
			}
		});
   });
   //确认收货
   $(".wrop a[node-type='receiptBtn']").on("click",function(){
	   var orderId = $(this).parent().attr('order-id');
		box.confirmBox(
			'是否确认收货？',{
				okValue: '确定',
                cancelValue: '取消'
			}
		).action({
			ok: function()
			{
				io.jsonp(
					$('#receive-url').val(),
					{orderId: orderId},
					function() {
						window.location.reload();
					},
					function (e) {
						box.tips(e.msg);
					}
				);
			}
		});
   });
   //申请售后
   $(".wrop a[node-type='serviceBtn']").on("click",function(){
        //获取跳链接的地址
        var check = $(this).attr('data-ship');
        var rqUrl = $(this).attr("data-url"),
            yes = rqUrl+"?type=2",
            no = rqUrl+"?type=1",
            orderId = $(this).parent().attr('order-id');
        if(check !== "1"){
            box.confirmBox(
                '是否已经收到货物？',{
                    okValue: '是的',
                    cancelValue: '没有'
                }
            ).action({
                ok: function()
                {
                    io.jsonp(
                        $('#receive-url').val(),
                        {orderId: orderId},
                        function() {
                            window.location.href = yes;
                        },
                        function (e) {
                            box.tips(e.msg);
                        }
                    );
                },
                cancel:function()
                {
                    window.location.href = no;
                }
            });
        }else{
            window.location.href = rqUrl;
        }
   });
   //删除订单
    $(".wrop a[node-type='deleteBtn']").on("click",function(){
        var orderId = $(this).parent().attr('order-id');
        box.confirmBox(
            '你确定要删除订单？！',{
                okValue: '删除',
                cancelValue: '取消' 
            }
        ).action({
            ok: function()
            {
                io.jsonp(
                    $('#delete-url').val(),
                    {orderId: orderId},
                    function (e) {
                        var backUrl = $("#after-del-url").val();
                        box.ok(e.msg);
                        setTimeout(function(){
                            window.location.href = backUrl;//返回订单列表页
                        },1000)
                    },
                    function (e) {
                        box.tips(e.msg); 
                    }
                );
            }
        });
    });

    //去付款  付尾款
    $(".wrop a[action-type='pay']").on("click", function(e) {
        var url = $(this).attr("data-url");
        if(url){
            io.jsonp(url, {}, 
                function(data) {
                    if (data && data.data) {
                        wx.miniProgram.getEnv(function(res) {
                            if(res.miniprogram){
                                wx.miniProgram.reLaunch({url: '/pages/homepage/homepage?title=线上购物&appSource=h5&source=forPay&merOrderNo='+data.data.phpPayToken.payCode+'&payOrderNo='+data.data.phpPayToken.payOrderNo+'&orderAmt='+data.data.phpPayToken.payAmount})
                                return
                            }
                        })
                        if(data.data.action){
                            location.href = data.data.action;
                        }
                    } 
                },
                function(e) {
                    //box.tips(e.msg);
                }
            );
        }
    });
    //联系商家
    
    //弹窗显示商家联系方式
    var ShowHtmlString = function(){
        var height = document.body.clientHeight;
        // $(".hide-all").show();
        $(".hide-all").height(height).show();
        $(".shad-contact").show(80);
        $(".hide-all").on('click', function() {
             $(".shad-contact").hide(80);
             setTimeout(function(){
                $(".hide-all").hide();
             },100);
             // $(this).hide();
        });
        $(".cancel").on('click', function() {
             $(".shad-contact").hide(80);
             setTimeout(function(){
                $(".hide-all").hide();
             },100);
             
        });

    }
    $(".mod-order-status .date").on('click', function() {
        ShowHtmlString();
    });

    // 复制订单号    微信内置浏览器不支持（该功能不上线）
    // ZeroClipboard.config( { swfPath: '//ssl.bbgstatic.com/super/js/module/order-detail/1.0.0/ZeroClipboard.swf' } );
    // var client = new ZeroClipboard( document.getElementById("jCopy"));
    // client.on("ready", function(){});
    // client.on("aftercopy", function(){
    //     box.tips("订单号已复制");
    // });

    // 显示条码，二维码
    $("#showQrCode").on('click', function () {
        var tpl = [
            // '<div class="qrcode-box" style="width:'+ $(window).width() * 0.9 +'px;left:'+ $(window).width() * 0.05 +'px;">',
            '<div class="qrcode-box" style="width:'+ $(window).width() * 0.9 +'px;">',
            '<div class="qrcode-body">',
            '<img id="barcode" class="barcode" />',
            //'<p class="align-center">条形码编号</p>',
            '<div id="qrcode" class="qrcode"></div>',
            '<p class="align-center">请向门店工作人员展示此码</p>',
            '</div>',
            '<a class="btn" action-type="ok">知道了</a>',
            '</div>'
        ];
        var qrcodeText = $(this).attr("data-ztmcode");
        var b = box.create(tpl.join(''),{
                clickBlankToHide: true, //点击空白关闭
                modal: true
            }
        );
        b.show();
        // BarCode
        try {
            JsBarcode("#barcode", qrcodeText, {
                format: "CODE39",   //选择要使用的条形码类型
                width: 3,            //设置条之间的宽度
                height: 100,         //高度
                displayValue: true //是否在条形码下方显示文字
            });
        }catch(e) {
            console.error(e);
        }
        // QRCode
        new QRCode(document.getElementById("qrcode"), {
            text: qrcodeText,
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });

});




