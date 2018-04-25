<?php
    header('Content-type: text/json');
    $callback = isset($_GET["callback"])?$_GET["callback"]:"callback";
	$parentId = $_GET["parentId"];
	$obj = array('data'=>array(array('parentId'=>$parentId,'textId'=>$parentId.'1','checked'=>'false','text'=>'元素'.$parentId.'1'), array('parentId'=>$parentId,'textId'=>$parentId.'2','checked'=>'false','text'=>'元素'.$parentId.'2'), array('parentId'=>$parentId,'textId'=>$parentId.'3','checked'=>'false','text'=>'元素'.$parentId.'3'), array('parentId'=>$parentId,'textId'=>$parentId.'4','checked'=>'false','text'=>'元素'.$parentId.'4'), array('parentId'=>$parentId,'textId'=>$parentId.'5','checked'=>'false','text'=>'元素'.$parentId.'5')));
    echo $callback . "(". json_encode($obj). ")";
    exit;
?>
