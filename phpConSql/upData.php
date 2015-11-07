<?php
	
	if(isset($_POST['upData']) && isset($_POST['data_select'])){
		$upData = $_POST['upData'];
		$data_select = $_POST['data_select'];
	}else{
		die('<script>document.write("传输数据方式非法.");</script>;');
	}
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	// 选择 数据表 获取修改时间
	$dataBase = $sql->sqlDivisionTable($data_select);
	$time = $sql->sqlGetCurrentTime();
	
	foreach($upData as $value){
		$array = explode(',',$value);
		$id = $array[0];
		$name = $array[1];
		$content = $array[2];
		$query = 'update '.$dataBase.' set dataName="'.$name.'",dataContent="'.$content.'",dataDate="'.$time.'" where id='.$id;
		$result = $sql->sqlDml($query);
	}
	
	$sql->sqlClose();
	
	// 返回 修改结果0/1/2 与 修改时间
	$res = array('flag'=>$result,'time'=>$time);
	
	$res = json_encode($res);
	
	echo $res;
	
	
	
?>	 
	