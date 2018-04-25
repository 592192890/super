<?php
    header('Content-type: text/json');
    $callback = isset($_GET["callback"])?$_GET["callback"]:false;
    /* 测试数据 begin */
    //disable(不可点击), storeNotice(到货通知事件), addCart(添加购物车事件), buy(立即购买事件)
    $json_string='{
        "error": 0,  
        "msg": "兑换成功",
        "data": {},
        "ver": "0.1"
    }';
    /* 测试数据 end */
    $obj=json_decode($json_string);
	if($callback){
		echo $callback . "(". json_encode($obj). ")";
	}else{
		echo json_encode($obj);
	}
    exit;
?>
