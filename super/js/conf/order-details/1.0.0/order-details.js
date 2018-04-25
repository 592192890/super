/**
 * @file order-details.js
 * @synopsis  详细订单
 * @author lvyonghua, lvyonghua416000@163.com
 * @version 1.0.0
 * @date 2017-03-15
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
		box = require('common/box/1.0.0/box'),
		io = require('lib/core/1.0.0/io/request'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
        // dialog = require('common/base/dialog');
		require('module/order-detail/1.0.0/action');
    

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
});



