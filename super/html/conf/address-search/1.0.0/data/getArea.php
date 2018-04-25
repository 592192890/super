<?php
    header('Content-type: text/json');
    $callback = isset($_GET["callback"])?$_GET["callback"]:false;
    /* 测试数据 begin */
    //disable(不可点击), storeNotice(到货通知事件), addCart(添加购物车事件), buy(立即购买事件)
    $json_string='{
        "error": 0,  
        "msg": "兑换成功",
				"data": [{
"address": "东方红路657号(东方红路与枫林三路交汇处)",
        "cityCode": "430100000000",
        "cityName": "长沙市",
        "distance": 1,
        "districtCode": "430104000000",
        "districtName": "岳麓区",
        "id": 1,
        "name": "步步高梅溪湖店",
        "point": {
            "lat": 28.198135,
            "lng": 112.861197
        },
        "points": [
            {
                "lat": 28.214567,
                "lng": 112.853794
            },
            {
                "lat": 28.213659,
                "lng": 112.880917
            },
            {
                "lat": 28.208441,
                "lng": 112.881002
            },
            {
                "lat": 28.203297,
                "lng": 112.882977
            },
            {
                "lat": 28.205094,
                "lng": 112.887504
            },
            {
                "lat": 28.201179,
                "lng": 112.889907
            },
            {
                "lat": 28.198343,
                "lng": 112.884994
            },
            {
                "lat": 28.194674,
                "lng": 112.888877
            },
            {
                "lat": 28.190419,
                "lng": 112.88244
            },
            {
                "lat": 28.186504,
                "lng": 112.877569
            },
            {
                "lat": 28.18813,
                "lng": 112.870038
            },
            {
                "lat": 28.18987,
                "lng": 112.867355
            },
            {
                "lat": 28.187185,
                "lng": 112.86315
            },
            {
                "lat": 28.184045,
                "lng": 112.861776
            },
            {
                "lat": 28.20065,
                "lng": 112.840919
            },
            {
                "lat": 28.212601,
                "lng": 112.84152
            }
				],
        "provinceCode": "43",
        "provinceName": "湖南",
        "visible": true
}],
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
