<?php
    header('Content-type: text/json');
    $callback = isset($_GET["callback"])?$_GET["callback"]:false;
    /* 测试数据 begin */
    //disable(不可点击), storeNotice(到货通知事件), addCart(添加购物车事件), buy(立即购买事件)
	//当 data 为空字符串时,加载完毕
    // $json_string='{"error":0,"msg":null,"data":{"html":"<div style=\"height:200px;\">数据</div>"}}'; 
	
    $json_string='{"error":0,"msg":null,"data":{"html":"<div class=\"mod-pro-list mod-coupon jCoupon\" style=\"height:3.4rem\" data-id=\"2\"><button class=\"ui-btn-primary ui-btn-mini ui-btn-radius jReceive\">测试<\/button><\/div>"}}'; 
    /* 测试数据 end */
    $obj=json_decode($json_string);
	if($callback){
		echo $callback . "(". json_encode($obj). ")";
	}else{
		echo json_encode($obj);
	}
    exit;
?>
