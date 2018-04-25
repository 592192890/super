<?php
header('Content-type: text/json');
$callback = isset($_GET["callback"]) ? $_GET["callback"] : "callback";
/* 测试数据 begin
 *     "idCheckType":"0"//0:什么都不显示;1:显示姓名和身份证号;2:显示所有
*     */
$json_string = '{"error":0, "data":{"leftSecond":3}}';
/* 测试数据 end */
$obj = json_decode($json_string);
echo json_encode($obj);
exit; ?>
