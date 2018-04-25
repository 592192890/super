<?php
header('Content-type: text/json');
$callback = isset($_GET["callback"]) ? $_GET["callback"] : "callback";
/* 测试数据 begin 
    "idCheckType":"0"//0:什么都不显示;1:显示姓名和身份证号;2:显示所有
*/
$json_string = '{"data":{
	"isLocalDelivery":false,
	"n1":"100",
	"n2":"200",
    "localAddress":"步步高梅西新天地",
	"global_tips" : "温馨提示信息",
	"totalTaxPrice":"66.5",
    "_bXs":"cookie测试的值",
    "idCheckType":"0",
    "beUsed":0,
    "totalPrice": 5870,
    "totalFreight": 0,
    "totalPmt": 587,
    "giftWeight": 0,
    "productWeight": 1210.00,
    "totalGiftPrice": 0,
    "totalSalePrice": 5870,
    "score": 61,
    "memberId": 577249,
	"selfPoints":{
		"name":"李里",
		"mobile":"15111031527"
	},
    "addresses": [{
			 "addrId": 122098,
            "memberId": 4237228,
            "name": "\u866b\u5e08",
            "lastname": null,
            "firstname": null,
            "area": null,
            "addr": "\u6b65\u6b65\u9ad8\u738b\u5e9c\u5e97",
            "zip": null,
            "tel": "",
            "mobile": "13600001315",
            "day": "\u4efb\u610f\u65e5\u671f",
            "time": "\u4efb\u610f\u65f6\u95f4\u6bb5",
            "defAddr": false,
            "selfName": "\u957f\u6c99\u738b\u5e9c\u5e97",
            "selfAddr": "\u957f\u6c99\u5e02\u738b\u5e9c\u5e97\u6e58\u6c5f\u4e16\u7eaa\u57ce\u548f\u6c5f\u82d1\u5e02\u653f\u9053\u8def\u5c42-11847\u3001-11848\u53f7",
            "areaInfo": "\u957f\u6c99\u5e02_\u8299\u84c9\u533a_\u8f66\u7ad9\u5317\u8def_\u6b65\u6b65\u9ad8\u738b\u5e9c\u5e97:430100000000_430102000000_430102010000_430102010100",
            "addrType": "0",
            "selectSelf": true,
            "selfId": 38,
            "areaName": "\u957f\u6c99\u5e02\u8299\u84c9\u533a\u8f66\u7ad9\u5317\u8def\u6b65\u6b65\u9ad8\u738b\u5e9c\u5e97",
            "selected": true,
            "needEdit": false
	}],
    "idCard" : {
        "id": 3,
        "realName": "dd",
        "idCard": "43*************062",
        "fullIdCard":"430222199007011062",
        "frontName" :"正面图名字.png",
        "frontImg": "http:\/\/img04.bubugao.com\/14b592633a7_65_5ad6f8e120faefaf3b25ea8cd8c318c3_391x390.jpeg",
        "reverseImg": "http:\/\/img04.bubugao.com\/14b592633a7_65_5ad6f8e120faefaf3b25ea8cd8c318c3_391x390.jpeg",
        "reverseName" :"反面图名字.png",
        "selected": true
    },
    "idCards": [],
    "area": "湖南_湘潭市_雨湖区:43_430300000000_430302000000",
    "groups": [{
        "totalPrice": 587,
		"totalTaxPrice":"10",
        "totalFreight": 0,
        "totalPmt": 587,
        "giftWeight": 0,
        "productWeight": 1210.00,
        "totalGiftPrice": 0,
        "totalSalePrice": 5870,
        "score": 61,
        "shopId": 1,
        "shopName": "云猴网自营",
        "shopType": 2,
		"testAr" : [1,2],
		"isMarkingOut":true,
		"quantity": 1,
		"totalDiscount":"20.00",
		"pkgs": [{
			"totalTaxPrice":"10",
            "index": 2,
            "items": [{
				"totalTaxPrice":"12.00",
                "productId": 388000457,
                "goodsId": 388000235,
                "productName": "东江清水茶油鱼块500g",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": "纯天然茶油烹制，东江鱼",
                "barcode": "2080000339988",
                "bn": "101878672",
                "price": 4880,
                "salePrice": 4880,
                "weight": 500.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "QG001",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_OTHER",
                "stock": 27,
                "limit": 27,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 202,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163519532,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
                "totalWeight": 500.00,
                "bargainPrice": 4880,
				"totalRealPrice": 4880,
				"subtotal":"23",
				"canSelected": true,
                "bizType":"presale",
				"mktprice":"1.00",
				"stockName":"1",
				"idCheck": false
            },{
                "productId": 388000457,
                "goodsId": 388000235,
                "productName": "东江清水茶油鱼块500g",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": "纯天然茶油烹制，东江鱼",
                "barcode": "2080000339988",
                "bn": "101878672",
                "price": 4880,
                "salePrice": 4880,
                "weight": 500.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "QG001",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_OTHER",
                "stock": 27,
                "limit": 27,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 202,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163519532,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
                "totalWeight": 500.00,
                "bargainPrice": 4880,
				"totalRealPrice": 4880,
				"subtotal":"23",
				"canSelected": true,
                "bizType":"group",
				"idCheck": false
            }],
            "orderType": "self",
            "bizType": "normal",
            "warehouseId": "QG001",
            "warehouseType": "EAI",
            "warehouseTag": "TAG_OTHER",
            "gifts": [],
            "showJlSaler": false
		}],
        "deliveries": [{
            "id": 23,
            "shopId": 1,
            "title": "普通快递",
            "description": "商品实付金额满99元5KG内包邮，长株潭满59元包10Kg",
            "configId": 1,
            "firstUnit": 10000,
            "continueUnit": 1000,
            "firstPrice": 1000,
            "continuePrice": 100,
            "freeDeliverys": [{
                "money": 5900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 9900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 15000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 39900,
                "weight": 20000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 49900,
                "weight": 25000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 5000,
                "weight": 5000,
                "freeMoney": 200,
                "item": 0
            }, {
                "money": 9900,
                "weight": 5000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 19900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 15000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 5000,
                "weight": 5000,
                "freeMoney": 100,
                "item": 0
            }, {
                "money": 9900,
                "weight": 5000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 19900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 150000,
                "freeMoney": 0,
                "item": 0
            }],
            "selected": false,
            "totalFreight": 800,
            "arithmeticOpen": true,
            "arithmeticMoney": 10000,
            "arithmeticWeight": 5000,
            "type": 0,
            "arithmeticItem": 0,
            "isSelf": false
        }, {
            "id": 340,
            "shopId": 1,
            "title": "北新泾自提1111111",
            "description": "凤飞飞",
            "configId": 333,
            "freeDeliverys": [],
            "selected": false,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": false,
            "cartDeliverySelfs": []
        }, {
            "id": 330,
            "shopId": 1,
            "title": "免除快递",
            "description": "111",
            "configId": 311,
            "firstUnit": 1000,
            "continueUnit": 1000,
            "firstPrice": 100,
            "continuePrice": 100,
            "freeDeliverys": [{
                "money": 0,
                "weight": 1000,
                "freeMoney": 100,
                "item": 0
            }],
            "selected": false,
            "totalFreight": 100,
            "arithmeticOpen": true,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 0,
            "isSelf": false
        }, {
            "id": 341,
            "shopId": 1,
            "title": "自提（ABC）",
            "description": "侯家塘a\r\n雨花亭b\r\n文艺路c",
            "configId": 334,
            "freeDeliverys": [],
            "selected": false,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": true,
            "cartDeliverySelfs": [{
                "transportId": 341,
                "transportConfigId": 334,
                "swcCode": "a",
                "regionId": "43,430100000000,430111000000,430111010000",
                "name": "A",
                "address": "湖南长沙市雨花区侯家塘街道A",
                "selected": false
            }, {
                "transportId": 341,
                "transportConfigId": 335,
                "swcCode": "b",
                "regionId": "43,430100000000,430111000000,430111060000",
                "name": "B",
                "address": "湖南长沙市雨花区雨花亭街道B",
                "selected": true
            }, {
                "transportId": 341,
                "transportConfigId": 336,
                "swcCode": "c",
                "regionId": "43,430100000000,430102000000,430102010000",
                "name": "C",
                "address": "湖南长沙市芙蓉区文艺路街道C",
                "selected": false
            }]
        }, {
            "id": 342,
            "shopId": 1,
            "title": "上门自提",
            "description": "运费为0",
            "configId": 337,
            "freeDeliverys": [],
            "selected": true,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": true,
            "cartDeliverySelfs": [{
                "transportId": 342,
                "transportConfigId": 337,
                "swcCode": "1",
                "regionId": "43,430100000000,430104000000,430104030000",
                "name": "湖南长沙市岳麓区麓谷信息港658号A栋17楼",
                "address": "湖南长沙市岳麓区麓谷街道湖南长沙市岳麓区麓谷信息港658号A栋17楼",
                "selected": true
            }, {
                "transportId": 342,
                "transportConfigId": 338,
                "swcCode": "2",
                "regionId": "43,430300000000,430304000000,430304160000",
                "name": "湖南省湘潭市岳塘区荷塘物流园",
                "address": "湖南湘潭市岳塘区荷塘乡湖南省湘潭市岳塘区荷塘物流园",
                "selected": false
            }, {
                "transportId": 342,
                "transportConfigId": 339,
                "swcCode": "3",
                "regionId": "43,430300000000,430302000000,430302010000",
                "name": "湖南省湘潭市雨湖区金海步步高",
                "address": "湖南湘潭市雨湖区雨湖路街道湖南省湘潭市雨湖区金海步步高",
                "selected": false
            }]
		}],
        
        "hasInCoupon":true,
        "useCoupon" : {
            "type" : "in"
        },
        "inCoupons": [{
            "code": "TT981D66D5C070D880",
            "cpnsName": "\u51ed\u4e91\u7334\u6697\u53f7\u53bb\u4e91\u7334\u7f51\u8d2d\u7269\u53ef\u7acb\u51cf10\u5143\u3002",
            "type": "in",
            "selected": true
        },{
            "code": "TT981D66D5C070D880",
            "cpnsName": "\u51ed\u4e91\u7334\u6697\u53f7\u53bb\u4e91\u7334\u7f51\u8d2d\u7269\u53ef\u7acb\u51cf10\u5143\u3002",
            "type": "in",
            "selected":false 
        }],
        "promotions": [{
            "activityId": 4058,
            "name": "kk",
            "ad": "kk",
            "discount": 587,
            "toolCode": "ump-order-zk",
            "toolName": "折扣"
        },{
            "activityId": 4058,
            "name": "kk222",
            "ad": "kk",
            "discount": 587,
            "toolCode": "ump-order-zk",
            "toolName": "折扣2"
        }],
        "giftCoupons": [],
        "twoDomain": "bubugao",
        "qq": "8000922681",
        "tipStatus": 0,
        "shopTag": "",
        "totalWeight": 1210.00,
        "totalRealPrice": 5283,
        "totalProductPrice": 5283
    },{
        "totalPrice": 58,
        "totalFreight": 0,
        "totalPmt": 587,
        "giftWeight": 0,
        "productWeight": 1210.00,
        "totalGiftPrice": 0,
        "totalSalePrice": 5870,
        "score": 61,
        "shopId": 1,
        "shopName": "云猴网自营",
        "shopType": 2,
		"testAr" : [1,2],
        "pkgs": [{
            "index": 1,
            "items": [{
                "productId": 388000478,
                "goodsId": 388000256,
                "productName": "番茄派 玫瑰嫩白温和去角质手膜（搓死皮型）2片装",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": " 韩版膜套 15分钟去角质 亲肤更嫩白 柔嫩爽滑",
                "barcode": "6956741709198",
                "bn": "101869282",
                "price": 990,
                "salePrice": 990,
                "weight": 710.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "SX0101",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_SX",
                "stock": 6,
                "limit": 6,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 3950001,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163511202,
                "specList": [],
				"totalWeight": 710.00,
				"subtotal":"123",
                "bargainPrice": 990,
                "totalRealPrice": 990,
                "canSelected": true,
                "idCheck": false
            }],
            "orderType": "fresh",
            "bizType": "normal",
            "warehouseId": "SX0101",
            "warehouseType": "EAI",
            "warehouseTag": "TAG_SX",
            "gifts": [],
            "showJlSaler": false
        }, {
            "index": 2,
            "items": [{
                "productId": 388000457,
                "goodsId": 388000235,
                "productName": "东江清水茶油鱼块500g",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": "纯天然茶油烹制，东江鱼",
                "barcode": "2080000339988",
                "bn": "101878672",
                "price": 4880,
                "salePrice": 4880,
                "weight": 500.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "QG001",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_OTHER",
                "stock": 27,
                "limit": 27,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 202,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163519532,
                "specList": [],
                "totalWeight": 500.00,
                "bargainPrice": 4880,
				"totalRealPrice": 4880,
				"subtotal":"23",
				"canSelected": true,
				"idCheck": false
            }],
            "orderType": "self",
            "bizType": "normal",
            "warehouseId": "QG001",
            "warehouseType": "EAI",
            "warehouseTag": "TAG_OTHER",
            "gifts": [],
            "showJlSaler": false
        }],
        "deliveries": [{
            "id": 23,
            "shopId": 1,
            "title": "普通快递",
            "description": "商品实付金额满99元5KG内包邮，长株潭满59元包10Kg",
            "configId": 1,
            "firstUnit": 10000,
            "continueUnit": 1000,
            "firstPrice": 1000,
            "continuePrice": 100,
            "freeDeliverys": [{
                "money": 5900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 9900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 15000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 39900,
                "weight": 20000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 49900,
                "weight": 25000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 5000,
                "weight": 5000,
                "freeMoney": 200,
                "item": 0
            }, {
                "money": 9900,
                "weight": 5000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 19900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 15000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 5000,
                "weight": 5000,
                "freeMoney": 100,
                "item": 0
            }, {
                "money": 9900,
                "weight": 5000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 19900,
                "weight": 10000,
                "freeMoney": 0,
                "item": 0
            }, {
                "money": 29900,
                "weight": 150000,
                "freeMoney": 0,
                "item": 0
            }],
            "selected": false,
            "totalFreight": 800,
            "arithmeticOpen": true,
            "arithmeticMoney": 10000,
            "arithmeticWeight": 5000,
            "type": 0,
            "arithmeticItem": 0,
            "isSelf": false
        }, {
            "id": 340,
            "shopId": 1,
            "title": "北新泾自提1111111",
            "description": "凤飞飞",
            "configId": 333,
            "freeDeliverys": [],
            "selected": false,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": false,
            "cartDeliverySelfs": []
        }, {
            "id": 330,
            "shopId": 1,
            "title": "免除快递",
            "description": "111",
            "configId": 311,
            "firstUnit": 1000,
            "continueUnit": 1000,
            "firstPrice": 100,
            "continuePrice": 100,
            "freeDeliverys": [{
                "money": 0,
                "weight": 1000,
                "freeMoney": 100,
                "item": 0
            }],
            "selected": false,
            "totalFreight": 100,
            "arithmeticOpen": true,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 0,
            "isSelf": false
        }, {
            "id": 341,
            "shopId": 1,
            "title": "自提（ABC）",
            "description": "侯家塘a\r\n雨花亭b\r\n文艺路c",
            "configId": 334,
            "freeDeliverys": [],
            "selected": false,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": true,
            "cartDeliverySelfs": [{
                "transportId": 341,
                "transportConfigId": 334,
                "swcCode": "a",
                "regionId": "43,430100000000,430111000000,430111010000",
                "name": "A",
                "address": "湖南长沙市雨花区侯家塘街道A",
                "selected": false
            }, {
                "transportId": 341,
                "transportConfigId": 335,
                "swcCode": "b",
                "regionId": "43,430100000000,430111000000,430111060000",
                "name": "B",
                "address": "湖南长沙市雨花区雨花亭街道B",
                "selected": true
            }, {
                "transportId": 341,
                "transportConfigId": 336,
                "swcCode": "c",
                "regionId": "43,430100000000,430102000000,430102010000",
                "name": "C",
                "address": "湖南长沙市芙蓉区文艺路街道C",
                "selected": false
            }]
        }, {
            "id": 342,
            "shopId": 1,
            "title": "上门自提",
            "description": "运费为0",
            "configId": 337,
            "freeDeliverys": [],
            "selected": true,
            "totalFreight": 0,
            "arithmeticOpen": false,
            "arithmeticMoney": 0,
            "arithmeticWeight": 0,
            "type": 2,
            "isSelf": true,
            "cartDeliverySelfs": [{
                "transportId": 342,
                "transportConfigId": 337,
                "swcCode": "1",
                "regionId": "43,430100000000,430104000000,430104030000",
                "name": "湖南长沙市岳麓区麓谷信息港658号A栋17楼",
                "address": "湖南长沙市岳麓区麓谷街道湖南长沙市岳麓区麓谷信息港658号A栋17楼",
                "selected": true
            }, {
                "transportId": 342,
                "transportConfigId": 338,
                "swcCode": "2",
                "regionId": "43,430300000000,430304000000,430304160000",
                "name": "湖南省湘潭市岳塘区荷塘物流园",
                "address": "湖南湘潭市岳塘区荷塘乡湖南省湘潭市岳塘区荷塘物流园",
                "selected": false
            }, {
                "transportId": 342,
                "transportConfigId": 339,
                "swcCode": "3",
                "regionId": "43,430300000000,430302000000,430302010000",
                "name": "湖南省湘潭市雨湖区金海步步高",
                "address": "湖南湘潭市雨湖区雨湖路街道湖南省湘潭市雨湖区金海步步高",
                "selected": false
            }]
        }],
        "hasInCoupon":true,
        "useCoupon" : {
			"code":"qwer34",
			"discount":"300",
            "type" : "in"
        },
		"coupons_list":[{"code":"123"}],
        "inCoupons": [{
            "code": "TT981D66D5C070D880",
            "cpnsName": "\u51ed\u4e91\u7334\u6697\u53f7\u53bb\u4e91\u7334\u7f51\u8d2d\u7269\u53ef\u7acb\u51cf10\u5143\u3002",
            "type": "in",
            "selected": true
        },{
            "code": "TT981D66D5C070D880",
            "cpnsName": "\u51ed\u4e91\u7334\u6697\u53f7\u53bb\u4e91\u7334\u7f51\u8d2d\u7269\u53ef\u7acb\u51cf10\u5143\u3002",
            "type": "in",
            "selected":false 
        }],
        "promotions": [{
            "activityId": 4058,
            "name": "kk",
            "ad": "kk",
            "discount": 587,
            "toolCode": "ump-order-zk",
            "toolName": "折扣"
        },{
            "activityId": 4058,
            "name": "kkkkkkkjjj",
            "ad": "kk",
            "discount": 587,
            "toolCode": "ump-order-zk",
            "toolName": "折扣33"
        }],
        "giftCoupons": [],
        "twoDomain": "bubugao",
        "qq": "8000922681",
        "tipStatus": 0,
        "shopTag": "",
        "totalWeight": 1210.00,
        "totalRealPrice": 5283,
        "totalProductPrice": 5283
    }],
	"unableItems":[{
				"totalTaxPrice":"12.00",
                "productId": 388000478,
                "goodsId": 388000256,
				"qtyTips":"不可配送赠品",
                "productName": "番茄派 玫瑰嫩白温和去角质手膜（搓死皮型）2片装124",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": " 韩版膜套 15分钟去角质 亲肤更嫩白 柔嫩爽滑",
                "barcode": "6956741709198",
                "bn": "101869282",
                "price": 990,
                "salePrice": 990,
                "weight": 710.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "SX0101",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_SX",
                "stock": 6,
                "limit": 6,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 3950001,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163511202,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
				"totalWeight": 710.00,
				"subtotal":"1234",
                "bargainPrice": 990,
                "totalRealPrice": 990,
                "canSelected": true,
                "idCheck": false
            }],
		"unableGifts":[{
                "productId": 388000478,
                "goodsId": 388000256,
				"qtyTips":"不可配送赠品",
                "productName": "番茄派 玫瑰嫩白温和去角质手膜（搓死皮型）2片装",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": " 韩版膜套 15分钟去角质 亲肤更嫩白 柔嫩爽滑",
                "barcode": "6956741709198",
                "bn": "101869282",
                "price": 990,
                "salePrice": 990,
                "weight": 710.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "SX0101",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_SX",
                "stock": 6,
                "limit": 6,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 3950001,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163511202,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
				"totalWeight": 710.00,
				"subtotal":"123",
                "bargainPrice": 990,
                "totalRealPrice": 990,
                "canSelected": true,
				"giftTag":"赠",
                "idCheck": false
            }],
		"unableGroups":[{
                "productId": 388000478,
				"goodsId": 388000256,
				"qtyTips":"不可配送团购商品",
                "productName": "番茄派 玫瑰嫩白温和去角质手膜（搓死皮型）2片装",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": " 韩版膜套 15分钟去角质 亲肤更嫩白 柔嫩爽滑",
                "barcode": "6956741709198",
                "bn": "101869282",
                "price": 990,
                "salePrice": 990,
                "weight": 710.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "SX0101",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_SX",
                "stock": 6,
                "limit": 6,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 3950001,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163511202,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
				"totalWeight": 710.00,
				"subtotal":"123",
                "bargainPrice": 990,
                "totalRealPrice": 990,
                "canSelected": true,
                "idCheck": false
            }],
		"unablePreSale":[{
                "productId": 388000478,
                "goodsId": 388000256,
					"qtyTips":"不可配送预售商品",
                "productName": "番茄派 玫瑰嫩白温和去角质手膜（搓死皮型）2片装",
                "productImage": "http:\/\/img04.bubugao.com\/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1",
                "productAd": " 韩版膜套 15分钟去角质 亲肤更嫩白 柔嫩爽滑",
                "barcode": "6956741709198",
                "bn": "101869282",
                "price": 990,
                "salePrice": 990,
                "weight": 710.00,
                "unit": "g",
                "totalPmt": 0,
                "totalSharePmt": 0,
                "quantity": 1,
                "shopId": 1,
                "shopType": 3,
                "warehouseId": "SX0101",
                "warehouseType": "EAI",
                "warehouseTag": "TAG_SX",
                "stock": 6,
                "limit": 6,
                "limitKind": 2147483647,
                "selected": true,
                "productStatus": 100,
                "promotions": [],
                "sale": true,
                "favorite": false,
                "backCatId": 3950001,
                "buyType": 2,
                "idCardCheck": 0,
                "addTime": 1433163511202,
                "specList": [{"name":"颜色","value":"红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色红色"}],
				"totalWeight": 710.00,
				"subtotal":"123",
                "bargainPrice": 990,
                "totalRealPrice": 990,
                "canSelected": true,
                "idCheck": false
            }],
    "createTax": false,
    "sign": "5e99f5f9b95ac1c6e9ba87a732de821a",
    "showJlSaler": false,
    "buyType": "normal",
    "source": "pc",
    "deliveryType": 1,
    "realArea": "湖南_长沙市_岳麓区_麓谷街道:43_430100000000_430104000000_430104030000",
    "totalRealPrice": 5283,
    "submitTag": 0,
	"submitTips":"提示信息",
    "needIdCheck": false,
	"showSelectSelf": true,
    "allowSubmit": true,
    "taxTag": 1,
    "totalWeight": 1210.00,
    "totalProductPrice": 5283
}}';
/* 测试数据 end */
$obj = json_decode($json_string);
echo $callback."(".json_encode($obj).")";
exit; ?>